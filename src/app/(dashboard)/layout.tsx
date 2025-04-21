import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { CreateProjectModel } from "@/feature/projects/components/create-project-model";
import { CreateTaskModel } from "@/feature/tasks/components/create-task-model";
import { CreateWorkspaceModel } from "@/feature/workspaces/components/create-workspace-model";

interface ChildrenProps {
  children: React.ReactNode;
}
export default function layout({ children }: ChildrenProps) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModel />
      <CreateProjectModel />
      <CreateTaskModel />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block h-full lg:w-[264px] overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <Navbar />
          <div className="mx-auto max-w-screen-2xl h-full">
            <main className="h-full lg:py-8 lg:px-6 py-6 px-3.5 flex flex-col">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
