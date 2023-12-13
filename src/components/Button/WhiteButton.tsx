'use client';

import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

interface WhiteButtonProps {
    text: string,
    href: string
  }

function WhiteButton(props:WhiteButtonProps) {
  const router = useRouter()
  return (
    <div className="flex flex-wrap gap-2">
      <Button color="dark" onClick={()=> router.push(props.href)}>{props.text}</Button>
    </div>
  );
};
export default WhiteButton;