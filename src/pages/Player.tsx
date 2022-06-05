import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { 
  Button, 
  ButtonGroup, 
  Center, 
  Flex, 
  Heading, 
  HStack, 
  IconButton, 
  Spinner, 
  Text, 
  VStack 
} from "@chakra-ui/react"

import { FiArrowLeft, FiRotateCcw } from "react-icons/fi"

import { useVideos } from "../hooks/useVideos"
import { Logo } from "../components/Logo"

export const Player = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useVideos()  
  
  const [playList, setPlayList] = useState<(string | undefined)[]>([])
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(0)  

  const playerRef = useRef<HTMLVideoElement>(null)
  
  const fullScreen = async () => {
    if(!document.fullscreenElement && document.fullscreenEnabled) {
      await playerRef.current?.requestFullscreen()
    }
  }
  
  const playNext = async () => {
    await refetch()        

    if(currentVideoPlaying < playList.length - 1) {      
      setCurrentVideoPlaying(currentVideoPlaying + 1)
      return
    } 
    setCurrentVideoPlaying(0)
    playerRef.current?.play()
    return
  }
  
  useEffect(() => {    
    if(data) {
      console.log('Caiu no useEffect do data')
      setPlayList([...data!])
      setCurrentVideoPlaying(0)
      playerRef.current?.load()
    }

  }, [data])

  useEffect(() => {
    playerRef.current?.requestFullscreen()
      .then(() => playerRef.current?.requestFullscreen())
      .catch(() => {})

  }, [])

  if(isLoading || !playList.length) {
    return (      
      <Center h="100vh">
        <Spinner size="lg" mr="4" />
        <Text>carregando...</Text>
      </Center>      
    )
  }
  
  if(isError) {
    return (
      <VStack spacing={24} w="100%" maxW="7xl" align="center">                
        <Logo />        
        <Heading size="lg">Ocorreu um erro ao carregar o vídeo</Heading>
        <ButtonGroup spacing={4}>
          <Button 
            colorScheme="whatsapp"             
            onClick={() => navigate('/')}
            leftIcon={<FiArrowLeft />}
          >Voltar</Button>
          <Button 
            colorScheme="whatsapp" 
            onClick={() => navigate(0)}
            leftIcon={<FiRotateCcw />}
          >Recarregar</Button>
        </ButtonGroup>
      </VStack>
    )
  }  

  return (
    <>      
      <Flex m="auto" flexDir="column" w="100%" h="100vh" maxW="5xl" align="center">
        <HStack mb="8" w="100%" align="center" justify="space-between">  
          <IconButton 
            aria-label="voltar" 
            variant="ghost" 
            onClick={() => navigate('/')}
            _hover={{ bg: 'green.500' }}
          >
            <FiArrowLeft fontSize="24"/>
          </IconButton>          
          <Logo />
          <Button colorScheme="whatsapp" onClick={fullScreen}>Tela cheia</Button>
        </HStack>
        
        <video
          src={playList[currentVideoPlaying]}
          muted
          autoPlay      
          ref={playerRef}                          
          controls={true}      
          onEnded={playNext}
        />

      </Flex>
    </>    
  )
}