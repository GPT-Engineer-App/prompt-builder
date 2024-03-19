import { useState } from "react";
import { Box, VStack, Text, Textarea, Button, Select, Input, Heading, Divider } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const COMPONENT_TYPES = {
  TEXT: "Text",
  PERSONALIZED: "Personalized",
};

const PersonalizedOptions = {
  JOB_TITLE: "Job Title",
  COMPANY: "Company",
  NAME: "Name",
  INDUSTRY: "Industry",
};

const Index = () => {
  const [components, setComponents] = useState([]);
  const [persona, setPersona] = useState({
    jobTitle: "",
    company: "",
    name: "",
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

  const generateMessage = () => {
    // TODO: Integrate with AI to generate personalized sentences
    const message = components
      .map(({ type, content }) => {
        if (type === COMPONENT_TYPES.TEXT) {
          return content;
        } else {
          // Replace placeholders with persona data
          return content.replace("{{jobTitle}}", persona.jobTitle).replace("{{company}}", persona.company).replace("{{name}}", persona.name).replace("{{industry}}", persona.industry);
        }
      })
      .join("\n\n");

    alert(`Generated Message:\n\n${message}`);
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={8}>LinkedIn Cold Outreach Message Builder</Heading>

      <VStack spacing={4} align="stretch">
        {components.map(({ type, content }, index) => (
          <Box key={index} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              {type === COMPONENT_TYPES.TEXT ? "Text Block" : "Personalized Block"}
            </Text>
            <Textarea value={content} onChange={(e) => updateComponent(index, e.target.value)} placeholder={type === COMPONENT_TYPES.TEXT ? "Enter your text here..." : "Enter your personalized message with {{placeholders}}..."} />
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
        <Heading size="md">Persona Details</Heading>
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
    </Box>
  );
};

export default Index;
