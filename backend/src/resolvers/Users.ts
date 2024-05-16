import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User, UserCreateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType, getUserFromReq } from "../auth";
import { UserToken } from "../entities/UserToken";
import { addDays, isBefore } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { sendResetPassword } from "../email";

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    const users = await User.find({});
    return users;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    });
    return user;
  }

  // @Authorized() removed to avoid error
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromReq(context.req, context.res);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`User already exist`);
    }

    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      email: data.email,
      hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Ctx() context: { req: any; res: any },
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const existingUser = await User.findOneBy({ email });
    if (existingUser) {
      if (await argon2.verify(existingUser.hashedPassword, password)) {
        // authentified!
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
            userId: existingUser.id,
          },
          process.env.JWT_SECRET || "supersecret"
        );

        // edit response headers to add set-cookie
        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24,
        });

        return existingUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg("email") email: string,
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const connectedUser = await getUserFromReq(context.req, context.res);
    if (connectedUser) {
      throw new Error("already connected");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = new UserToken();
    token.user = user;
    token.createdAt = new Date();
    token.expiresAt = addDays(new Date(), 2);
    token.token = uuidv4();

    await token.save();

    // send email
    await sendResetPassword(email, token.token);
    console.log(token);

    return true;
  }

  @Mutation(() => Boolean)
  async setPassword(
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const userToken = await UserToken.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!userToken) {
      throw new Error("invalid token");
    }

    if (isBefore(new Date(userToken.expiresAt), new Date())) {
      throw new Error("expired token");
    }

    // check new password validity

    const hashedPassword = await argon2.hash(password);
    userToken.user.hashedPassword = hashedPassword;
    await userToken.user.save();

    await userToken.remove();

    return true;
  }
}
