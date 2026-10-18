import { StatusScreen } from "@portfolio/ui-react";
import type { ReactElement } from "react";

import { ComingSoonIllustration } from "./components/ComingSoonIllustration";

export default function App(): ReactElement {
  return (
    <main className="flex min-h-svh flex-col bg-background px-6 py-12 text-foreground">
      <div className="my-auto w-full">
        <StatusScreen
          title="COMING SOON"
          illustration={
            <ComingSoonIllustration aria-hidden="true" focusable="false" />
          }
          subtitle={"Something awesome is in the works.\nCome back soon!"}
        />
      </div>
    </main>
  );
}
