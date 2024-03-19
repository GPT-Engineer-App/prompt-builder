import { useState, useEffect } from "react";
import { Box, VStack, Text, Textarea, Button, Select, Input, Heading, Divider } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const COMPONENT_TYPES = {
  TEXT: "Text",
  PERSONALIZED: "Personalized",
};

const PersonalizedOptions = {
  NAME: "Name",
  COMPANY: "Current Company",
  HIGHLIGHTED_EDUCATION: "Highlighted Education",
  JOB_TITLE: "Job Title",
  INDUSTRY: "Industry",
};

const Index = () => {
  const [components, setComponents] = useState([]);
  const [persona, setPersona] = useState({
    name: "",
    company: "",
    highlightedEducation: "",
    jobTitle: "",
    industry: "",
  });

  const addComponent = (type) => {
    setComponents([...components, { type, content: "" }]);
  };

  const updateComponent = (index, content) => {
    const updatedComponents = [...components];
    updatedComponents[index].content = content;
    setComponents(updatedComponents);
  };

  const deleteComponent = (index) => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
  };

  const updatePersona = (field, value) => {
    setPersona({ ...persona, [field]: value });
  };

  const [generatedMessage, setGeneratedMessage] = useState("");

  const generateMessage = () => {
    const message = components
      .map(({ content }) => {
        return content.replace("{{name}}", persona.name).replace("{{company}}", persona.company).replace("{{highlightedEducation}}", persona.highlightedEducation).replace("{{jobTitle}}", persona.jobTitle).replace("{{industry}}", persona.industry);
      })
      .join("\n\n");

    setGeneratedMessage(message);
  };

  useEffect(() => {
    setGeneratedMessage("");
  }, [components, persona]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData("text"), 10);
    const newComponents = [...components];
    const [removed] = newComponents.splice(sourceIndex, 1);
    newComponents.splice(targetIndex, 0, removed);
    setComponents(newComponents);
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={8}>LinkedIn Cold Outreach Message Builder</Heading>

      <VStack spacing={4} align="stretch">
        {components.map(({ type, content }, index) => (
          <Box key={index} p={4} borderWidth={1} borderRadius="md" draggable="true" onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)}>
            <Text fontWeight="bold" mb={2}>
              {type === COMPONENT_TYPES.TEXT ? "Text Block" : "Personalized Block"}
            </Text>
            <Textarea value={content} onChange={(e) => updateComponent(index, e.target.value)} placeholder="Enter your text here. Use {{jobTitle}}, {{company}}, {{name}}, {{industry}} as placeholders." />
            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} mt={2} onClick={() => deleteComponent(index)}>
              Delete
            </Button>
          </Box>
        ))}
      </VStack>

      <Box mt={8}>
        <Select placeholder="Add a component" onChange={(e) => addComponent(e.target.value)}>
          <option value={COMPONENT_TYPES.TEXT}>Text Block</option>
          <option value={COMPONENT_TYPES.PERSONALIZED}>Personalized Block</option>
        </Select>
      </Box>

      <Divider my={8} />

      <VStack spacing={4} align="stretch">
        <Heading size="md">Prospect Details</Heading>
        {Object.entries(PersonalizedOptions).map(([key, label]) => (
          <Box key={key}>
            <Text mb={1}>{label}</Text>
            <Input value={persona[key.toLowerCase()]} onChange={(e) => updatePersona(key.toLowerCase(), e.target.value)} placeholder={`Enter ${label}`} />
          </Box>
        ))}
      </VStack>

      <Button colorScheme="blue" size="lg" mt={8} onClick={generateMessage}>
        Generate Message
      </Button>

      {generatedMessage && (
        <Box mt={8} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md" mb={4}>
            Generated Message:
          </Heading>
          <Text whiteSpace="pre-wrap">{generatedMessage}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Index;
