import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { CreateWorkspaceModel } from "@/feature/workspaces/components/create-workspace-model";

interface ChildrenProps {
  children: React.ReactNode;
}
export default function layout({ children }: ChildrenProps) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModel />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block h-full lg:w-[264px] overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <Navbar />
          <div className="mx-auto max-w-screen-2xl h-full">
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
