import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface WorkspaceAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export default function WorkspaceAvatar({
  name,
  image,
  className,
}: WorkspaceAvatarProps) {
  if (image && image.trim() !== "") {
    return (
      <div
        className={cn("size-10 relative rounded-lg overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold !rounded-lg text-lg uppercase">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
