import React, { useState } from "react";
import { Box, Input, Button, VStack, useToast } from "@chakra-ui/react";

function BlockManager({ block, onSave }) {
  const [blockName, setBlockName] = useState(block.name);
  const [blockContent, setBlockContent] = useState(block.content);
  const toast = useToast();

  const handleSave = () => {
    onSave({ ...block, name: blockName, content: blockContent });
    toast({
      title: "Block saved.",
      description: "Your block's new name and content have been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4}>
      <Input placeholder="Enter block name" value={blockName} onChange={(e) => setBlockName(e.target.value)} />
      <Input placeholder="Enter block content" value={blockContent} onChange={(e) => setBlockContent(e.target.value)} />
      <Button colorScheme="blue" onClick={handleSave}>
        Save Block
      </Button>
    </VStack>
  );
}

export default BlockManager;
