
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Dropzone from "@/components/ui/dropzone";



export default function HomePage() {
 
    return (
      <>
        <div className="grid h-80 w-full place-content-center gap-4 mt-6">
          <Tabs defaultValue="textOnly" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="textOnly">Enter Text</TabsTrigger>
              <TabsTrigger value="uploadFiles">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="textOnly">
              <Textarea
                className="w-full h-48"
                placeholder="Type your message here."
              />
            </TabsContent>
            <TabsContent value="uploadFiles">
              <Dropzone dropZoneClassName="h-48"/>
            </TabsContent>
          </Tabs>
        </div>
        <Button>Analyze</Button>
      </>
    );
}
