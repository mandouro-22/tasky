import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";

export const ImagePreview = ({ value }: { value: File | string | null }) => {
  if (!value) {
    return (
      <Avatar className="h-[100px] w-[100px]">
        <AvatarFallback>
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const imageUrl = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div className="relative h-[100px] w-[100px] rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt="Project Icon"
        className="h-full w-full object-cover"
        width={73}
        height={73}
      />
    </div>
  );
};
