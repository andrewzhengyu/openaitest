'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';


export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const router = useRouter();

  const formschema = z.object({
    prompt: z.string()
  })
  type Tformschema = z.infer<typeof formschema>;

  const form = useForm<Tformschema>({
    resolver:zodResolver(formschema),
    defaultValues:{
      prompt:""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async(value:Tformschema) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: value.prompt,
      }
      const newMessages = [...messages, userMessage];
      console.log(newMessages)

      const response = await axios.post('/api/conversation', newMessages);

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error) {
      
    } finally {
      router.refresh()
    }

  }

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
          >
            <FormField
              name='prompt'
              render={({field}) => (
                <FormItem className='col-span-12 lg:col-span-10'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className='col-span-12 lg:col-span-2' disabled={isLoading}>
                Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className='space-y-4 mt-4'>
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div key={message.content}>
                {message.content}
              </div>
            ))}
            </div>    
      </div>
    </div>
  )
}
