import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";

const IndexPage = () => {
  const toast = useToast();
  const [promptName, setPromptName] = useState("");

  const handleSavePrompt = (e) => {
    e.preventDefault();

    toast({
      title: "Prompt Saved",
      description: `Your prompt "${promptName}" has been saved.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setPromptName("");
  };

  return (
    <Box mt={8}>
      <Button colorScheme="blue">Generate System Prompt</Button>
      <Box as="form" onSubmit={handleSavePrompt} mt={4}>
        <FormControl>
          <FormLabel htmlFor="prompt-name">Prompt Name</FormLabel>
          <Input id="prompt-name" placeholder="Enter prompt name" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Save Prompt
        </Button>
      </Box>
    </Box>
  );
};

export default IndexPage;
