import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import BlockManager from "../components/BlockManager";

function Index() {
  const [blocks, setBlocks] = useState([]);

  const handleSaveBlock = (blockData) => {
    setBlocks(blocks.map((block) => (block.id === blockData.id ? blockData : block)));
  };

  const renderedBlocks = blocks.map((block) => (
    <Box key={block.id} p={4} shadow="md" borderWidth="1px">
      <BlockManager block={block} onSave={handleSaveBlock} />
    </Box>
  ));

  return <Box>{renderedBlocks}</Box>;
}

export default Index;
