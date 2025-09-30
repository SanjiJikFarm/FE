import { z } from 'zod/v4';

export const SignupSchema = z.object({
  username: z
    .string()
    .min(3, { message: '아이디는 3자 이상이어야 합니다.' })
    .max(20, { message: '아이디는 20자 이하여야 합니다.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: '아이디는 영문, 숫자, 밑줄(_)만 포함할 수 있습니다.',
    }),
  password: z
    .string()
    .min(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
    .max(100, { message: '비밀번호는 100자 이하여야 합니다.' })
    .regex(/[a-z]/, { message: '비밀번호는 하나 이상의 영문 소문자가 포함되어야 합니다.' })
    .regex(/[0-9]/, { message: '비밀번호는 하나 이상의 숫자가 포함되어야 합니다.' })
    .regex(/[^a-zA-Z0-9]/, { message: '비밀번호는 하나 이상의 특수문자가 포함되어야 합니다.' }),
});
