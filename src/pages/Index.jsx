import { useState, useEffect, useCallback } from "react";
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
  const [savedComponents, setSavedComponents] = useState([]);
  const [persona, setPersona] = useState({
    name: "",
    company: "",
    highlightedEducation: "",
    jobTitle: "",
    industry: "",
  });

  const [user, setUser] = useState({
    name: "",
    title: "",
    company: "",
    customVariables: [{ name: "Custom Variable", value: "" }],
  });

  const addComponent = useCallback(
    (type) => {
      if (type.startsWith("saved:")) {
        const savedComponent = savedComponents.find((c) => c.name === type.slice(6));
        if (savedComponent) {
          setComponents([...components, { ...savedComponent }]);
        }
      } else {
        setComponents([...components, { type, content: "", name: "" }]);
      }
    },
    [components, savedComponents],
  );

  const updateComponent = (index, field, value) => {
    const updatedComponents = [...components];
    updatedComponents[index][field] = value;
    setComponents(updatedComponents);
  };

  const deleteComponent = (index) => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
  };

  const updatePersona = (field, value) => {
    setPersona({ ...persona, [field]: value });
  };

  const updateUser = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const updateCustomVariable = (index, field, value) => {
    const updatedCustomVariables = [...user.customVariables];
    updatedCustomVariables[index][field] = value;
    setUser({ ...user, customVariables: updatedCustomVariables });
  };

  const addCustomVariable = () => {
    setUser({
      ...user,
      customVariables: [...user.customVariables, { name: "", value: "" }],
    });
  };

  const [generatedMessage, setGeneratedMessage] = useState("");
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const generateMessage = async () => {
    const message =
      selectedPrompt ||
      components
        .map(({ content }) => {
          let personalizedContent = content;

          Object.entries(persona).forEach(([key, value]) => {
            personalizedContent = personalizedContent.replace(new RegExp(`{{${key}}}`, "g"), value);
          });

          Object.entries(user).forEach(([key, value]) => {
            if (key !== "customVariables") {
              personalizedContent = personalizedContent.replace(new RegExp(`{{user${key.charAt(0).toUpperCase() + key.slice(1)}}}`, "g"), value);
            }
          });

          user.customVariables.forEach(({ name, value }) => {
            personalizedContent = personalizedContent.replace(`{{${name}}}`, value);
          });

          return personalizedContent;
        })
        .join("\n\n");

    setGeneratedMessage(message);

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt: message,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log(data.choices[0].text);
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

  const saveComponent = (index) => {
    const component = components[index];
    setSavedComponents([...savedComponents, component]);
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={8}>LinkedIn Cold Outreach Message Builder</Heading>

      <VStack spacing={4} align="stretch">
        {components.map(({ type, content, name }, index) => (
          <Box key={index} p={4} borderWidth={1} borderRadius="md" draggable="true" onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)}>
            <Input value={name || ""} onChange={(e) => updateComponent(index, "name", e.target.value)} placeholder="Enter block name" mb={2} />
            <Text fontWeight="bold" mb={2}>
              {type === COMPONENT_TYPES.TEXT ? "Text Block" : "Personalized Block"}
            </Text>
            <Textarea value={content || ""} onChange={(e) => updateComponent(index, "content", e.target.value)} placeholder="Enter your text here. Use {{jobTitle}}, {{company}}, {{name}}, {{industry}}, {{userName}}, {{userTitle}}, {{userCompany}}, and custom variables as placeholders." />
            <Button size="sm" colorScheme="blue" mt={2} onClick={() => saveComponent(index)}>
              Save
            </Button>
            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} mt={2} ml={2} onClick={() => deleteComponent(index)}>
              Delete
            </Button>
          </Box>
        ))}
      </VStack>

      <Box mt={8}>
        <Select placeholder="Add a component" onChange={(e) => addComponent(e.target.value)}>
          <option value={COMPONENT_TYPES.TEXT}>Text Block</option>
          <option value={COMPONENT_TYPES.PERSONALIZED}>Personalized Block</option>
          {savedComponents.map((component, index) => (
            <option key={index} value={`saved:${component.name}`}>
              {component.name}
            </option>
          ))}
        </Select>
      </Box>

      <Divider my={8} />

      <VStack spacing={4} align="stretch">
        <Heading size="md">User Details</Heading>
        <Box>
          <Text mb={1}>Name</Text>
          <Input value={user.name} onChange={(e) => updateUser("name", e.target.value)} placeholder="Enter User Name" />
        </Box>
        <Box>
          <Text mb={1}>Title</Text>
          <Input value={user.title} onChange={(e) => updateUser("title", e.target.value)} placeholder="Enter User Title" />
        </Box>
        <Box>
          <Text mb={1}>Company</Text>
          <Input value={user.company} onChange={(e) => updateUser("company", e.target.value)} placeholder="Enter User Company" />
        </Box>
        {user.customVariables.map(({ name, value }, index) => (
          <Box key={index}>
            <Input value={name} onChange={(e) => updateCustomVariable(index, "name", e.target.value)} placeholder="Enter Custom Variable Name" />
            <Input mt={2} value={value} onChange={(e) => updateCustomVariable(index, "value", e.target.value)} placeholder="Enter Custom Variable Value" />
          </Box>
        ))}
        <Button onClick={addCustomVariable} mt={4}>
          Add Custom Variable
        </Button>
      </VStack>

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
      <Button colorScheme="green" size="lg" mt={2} onClick={() => setSavedPrompts([...savedPrompts, generatedMessage])}>
        Save Prompt
      </Button>

      {generatedMessage && (
        <Box mt={8} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md" mb={4}>
            Generated Message:
          </Heading>
          <Text whiteSpace="pre-wrap">{generatedMessage}</Text>
        </Box>
      )}

      <SavedPrompts prompts={savedPrompts} onSelectPrompt={setSelectedPrompt} />
    </Box>
  );
};

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const SavedPrompts = ({ prompts, onSelectPrompt }) => {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUsePrompt = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-002",
          prompt: `${selectedPrompt}\n\n${userMessage}`,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`API request failed with status ${response.status}: ${errorData.error.message}`);
      } else {
        const data = await response.json();
        setApiResponse(data.choices[0].text);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <Heading size="md" mb={4}>
        Saved Prompts:
      </Heading>
      {prompts.map((prompt, index) => (
        <Box key={index} mb={2}>
          <Text>{prompt}</Text>
          <Button
            size="sm"
            colorScheme="blue"
            mt={2}
            onClick={() => {
              setSelectedPrompt(prompt);
              onOpen();
            }}
          >
            Use Prompt
          </Button>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Use Prompt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter OpenAI API Key" mb={4} />
            <Textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Enter your message" />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUsePrompt} isLoading={isLoading}>
              Send
            </Button>
            {error && <Text color="red.500">{error}</Text>}
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {apiResponse && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md" mb={2}>
            API Response:
          </Heading>
          <Text>{apiResponse}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Index;
