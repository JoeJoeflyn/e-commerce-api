import { db } from "../utils/db.server";
import { createTokens } from "../jwt";
import { log } from "console";

type User = {
  name: string;
  email: string;
  password: string;
  remember_token: string;
};

export const listUsers = async (): Promise<User[]> => {
  return db.users.findMany({
    select: {
      name: true,
      email: true,
      password: true,
      remember_token: true,
    },
  });
};

export const getUser = async (id: number): Promise<User | null> => {
  return db.users.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      password: true,
      remember_token: true,
    },
  });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const user = await db.users.findFirst({
    where: {
      email,
    },
  });

  //TODO check user do not exist => return http error + message
  if (!user) {
    throw new Error("User does not exist");
  }

  //TODO compare password => do not match => return http error + message
  const isMatch = await Bun.password.verify(password, user.password);
  if (!isMatch) {
    throw new Error("Password does not correct");
  }

  const token = createTokens(user.email);

  return {
    user, // loi nay la do user khi query ra co the bi null => o dong 49 check user ton tai hay ko se fix ddc
    token,
  };
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { name, email, password, remember_token } = user;

  return db.users.create({
    data: {
      name,
      email,
      password,
      remember_token,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      remember_token: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, "id">,
  id: number
): Promise<User> => {
  const { name, email, password } = user;

  return db.users.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      remember_token: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.users.delete({
    where: {
      id,
    },
  });
};
