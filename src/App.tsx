// function App() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
//       <div className="w-full max-w-3xl text-center">
//         <p className="font-product text-base leading-snug tracking-tight break-words whitespace-normal text-gray-800 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
//           GDG - MeritMail - A desktop application for managing your emails with
//           ease and efficiency.
//         </p>
//         <p className="mt-4 text-sm text-gray-600">
//           Built with Electron, Vite, React, and Tailwind CSS.
//         </p>
//       </div>
//     </main>
//   );
// }

// export default App;

import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Data Visualization & Statistics
            </span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />

            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
