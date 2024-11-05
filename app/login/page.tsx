'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { listItensDelay } from '../animations';
import { Button, Input, toastSuccess } from '../components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginFormSchema = z.object({
  email: z.string().email('O e-mail fornecido não é válido.'),
  password: z.string({
    required_error: "Senha é obrigatório",
  }),
});

type loginFormInputs = z.infer<typeof loginFormSchema>;

export default function Login() {
  const router = useRouter();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormInputs>({
    resolver: zodResolver(loginFormSchema),
  });

  const handleLogin = ({ email, password }: loginFormInputs) => {
    const defaultEmail = 'admin@admin.com';
    const defaultPassword = 'admin';

    
    if (email === defaultEmail && password === defaultPassword) {
      toastSuccess({
        text: "Login feito com sucesso"
      })
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);

      setTimeout(() => {
        router.push('/products');
      }, 2000);
    } else {
      setError('password', {
        message: 'E-mail e/ou senha inválidos'
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#121212]">
      <h1 className="text-white text-2xl font-bold mb-4">Login</h1>
      <p className="text-white text-sm font-semibold mb-4">
        Entre com seu Email pra fazer login na sua conta
      </p>
      <form
        className="w-[30%] flex flex-col items-start justify-center"
        onSubmit={handleSubmit(handleLogin)}
      >
        <motion.label className="text-white mb-2 font-semibold" htmlFor="email" variants={listItensDelay}>
          E-mail
        </motion.label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="w-full h-12 p-2 mb-2"
              type="email"
              id="email"
              animation={true}
              variants={listItensDelay}
              placeholder="Digite seu e-mail"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-4">
            {errors.email.message}
          </p>
        )}
        
        <motion.label className="text-white mb-2 font-semibold" htmlFor="password" variants={listItensDelay}>
          Senha
        </motion.label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="w-full h-12 p-2 mb-2"
              type="password"
              id="password"
              animation={true}
              variants={listItensDelay}
              placeholder="Digite sua senha"
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">
            {errors.password.message}
          </p>
        )}
        
        
        <Button
          className="w-full h-12 mt-4"
          type="submit"
          variant="primary"
          text="Entrar"
          animation={true}
          variants={listItensDelay}
        />
      </form>
    </div>
  );
}
