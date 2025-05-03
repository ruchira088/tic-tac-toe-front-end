import {Box, Button, Modal, TextField} from "@mui/material"
import {faker} from "@faker-js/faker"
import {type FC, useEffect, useState} from "react"
import {createGame} from "~/services/game-service"
import {useNavigate} from "react-router"

const newGameModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

type NewGameModalProps = {
  onClose: () => void
}

const NewGameModal: FC<NewGameModalProps> = props => {
  const navigate = useNavigate()

  const [gameTitle, setGameTitle] = useState<string>("")

  useEffect(() => {
    setGameTitle(faker.internet.domainWord)
  }, [])

  const onCreate = async () => {
    const pendingGame = await createGame(gameTitle)
    navigate(`/game/id/${pendingGame.id}`)
  }

  return (
    <Box sx={newGameModalStyle}>
      <TextField
        label="Game Title"
        value={gameTitle}
        onChange={e => setGameTitle(e.target.value)}
      />
      <Button onClick={onCreate}>Create</Button>
      <Button onClick={props.onClose}>Close</Button>
    </Box>
  )
}

const Home = () => {
  const [isNewGameModalOpen, setNewGameModalOpen] = useState<boolean>(false)

  return (
    <div>
      <div>
        <Button onClick={() => setNewGameModalOpen(true)}>New Game</Button>
        <Button>Join Game</Button>
      </div>
      <Modal open={isNewGameModalOpen} onClose={() => setNewGameModalOpen(false)}>
        <NewGameModal onClose={() => setNewGameModalOpen(false)}/>
      </Modal>
    </div>
  )
}

export default Home