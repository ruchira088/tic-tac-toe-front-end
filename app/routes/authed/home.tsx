import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material"
import {faker} from "@faker-js/faker"
import {type FC, useEffect, useState} from "react"
import {createGame, getPendingGames, type PendingGame} from "~/services/game-service"
import {useNavigate} from "react-router"
import {useUser} from "~/contexts/user-context"

const modalStyle = {
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
  readonly onClose: () => void
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
    <Box sx={modalStyle}>
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

type JoinGameModalProps = {
  readonly onClose: () => void
}

const JoinGameModal: FC<JoinGameModalProps> = props => {
  const [pendingGames, setPendingGames] = useState<PendingGame[] | undefined>(undefined)
  const user = useUser()
  const navigate = useNavigate()

  const onJoin = (pendingGame: PendingGame) => {
    navigate(`/game/id/${pendingGame.id}`)
  }

  const loadPendingGames = async () => {
    const pendingGames: PendingGame[] = await getPendingGames()
    setPendingGames(pendingGames.filter(pendingGame => pendingGame.createdBy !== user.id))
  }

  useEffect(() => {
    loadPendingGames()
  }, [])

  const content = (() => {
    if (pendingGames === undefined) {
      return (
        <div>Loading</div>
      )
    } else if (pendingGames.length === 0) {
      return (
        <div>No Pending Games Found</div>
      )
    } else {
      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                pendingGames.map(pendingGame =>
                  <TableRow key={pendingGame.id} onClick={() => onJoin(pendingGame)}>
                    <TableCell>{pendingGame.title}</TableCell>
                    <TableCell>{pendingGame.createdAt}</TableCell>
                    <TableCell>{pendingGame.createdBy}</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      )
    }
  })()

  return (
    <Box sx={modalStyle}>
      {content}
      <Button onClick={props.onClose}>Close</Button>
    </Box>
  )
}

enum OpenModal {
  NewGame,
  JoinGame
}

const Home = () => {
  const [openModal, setOpenModal] = useState<OpenModal | undefined>(undefined)

  return (
    <div>
      <div>
        <Button onClick={() => setOpenModal(OpenModal.NewGame)}>New Game</Button>
        <Button onClick={() => setOpenModal(OpenModal.JoinGame)}>Join Game</Button>
      </div>
      <Modal open={openModal === OpenModal.NewGame} onClose={() => setOpenModal(undefined)}>
        <NewGameModal onClose={() => setOpenModal(undefined)}/>
      </Modal>
      <Modal open={openModal === OpenModal.JoinGame} onClose={() => setOpenModal(undefined)}>
        <JoinGameModal onClose={() => setOpenModal(undefined)}/>
      </Modal>
    </div>
  )
}

export default Home