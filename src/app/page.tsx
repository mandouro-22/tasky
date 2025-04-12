import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <Button variant={"primary"} size={"lg"}>
        default
      </Button>
      <Button variant={"destructive"}>destructive</Button>
      <Button variant={"ghost"}>ghost</Button>
      <Button variant={"muted"}>muted</Button>
      <Button variant={"outline"}>outline</Button>
      <Button variant={"secondary"}>secondary</Button>
      <Button variant={"teritary"}>teritary</Button>
    </div>
  );
}
