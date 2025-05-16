import {
  Box,
  Button,
  Card,
  CardContent,
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
import {useMatches, useNavigate} from "react-router"
import {useUser} from "~/contexts/user-context"
import {AuthenticationToken} from "~/services/kv-store"
import logo from "~/images/logo.svg"

import styles from "./home.module.scss"

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
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
    <Box sx={modalStyle} className={styles.newGameModal}>
      <TextField
        className={styles.newGameModalGameTitle}
        label="Game Title"
        value={gameTitle}
        onChange={e => setGameTitle(e.target.value)}
      />
      <div className={styles.newGameModalActions}>
        <Button onClick={onCreate} variant="contained" className={styles.newGameModalButton}>Create</Button>
        <Button onClick={props.onClose} variant="outlined" className={styles.newGameModalButton}>Close</Button>
      </div>
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
    setPendingGames(pendingGames)
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
      const pendingGamesCreatedByOthers: PendingGame[] =
        pendingGames.filter(pendingGame => pendingGame.createdBy !== user.id)

      const pendingGamesCreatedByUser =
        pendingGames.filter(pendingGame => pendingGame.createdBy === user.id)

      return (
        <div>
          {
            pendingGamesCreatedByOthers.length > 0 &&
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
                    pendingGamesCreatedByOthers
                      .map(pendingGame =>
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
          }
          {
            pendingGamesCreatedByUser.length > 0 &&
            pendingGamesCreatedByUser.map(pendingGame =>
              <Card onClick={() => onJoin(pendingGame)}>
                <CardContent>
                  <div>{pendingGame.title}</div>
                  <div>{pendingGame.createdAt}</div>
                </CardContent>
              </Card>
            )
          }
        </div>
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
  const matches = useMatches()
  const [openModal, setOpenModal] = useState<OpenModal | undefined>(undefined)

  const lastMatchId = matches[matches.length - 1].id

  useEffect(() => {
    if (lastMatchId === "new-game") {
      setOpenModal(OpenModal.NewGame)
    } else if (lastMatchId === "join-game") {
      setOpenModal(OpenModal.JoinGame)
    } else {
      setOpenModal(undefined)
    }
  }, [lastMatchId])

  const navigate = useNavigate()

  const onLogout = () => {
    AuthenticationToken.delete()
    navigate("/sign-in")
  }

  const navigateToHome = () => navigate("/home")

  return (
    <div className={styles.homePage}>
      <div className={styles.menu}>
        <div className={styles.header}>
          <img src={logo} alt="logo" className={styles.logo}/>
          <div className={styles.title}>Tic Tac Toe</div>
        </div>
        <div className={styles.topMenu}>
          <Button className={styles.option} variant="contained" onClick={() => navigate("/home/new-game")}>New
            Game</Button>
          <Button className={styles.option} variant="contained" onClick={() => navigate("/home/join-game")}>Join
            Game</Button>
        </div>
        <div className={styles.bottomMenu}>
          <Button className={styles.option} variant="outlined" onClick={onLogout}>Logout</Button>
        </div>
      </div>
      <Modal open={openModal === OpenModal.NewGame} onClose={navigateToHome}>
        <NewGameModal onClose={navigateToHome}/>
      </Modal>
      <Modal open={openModal === OpenModal.JoinGame} onClose={navigateToHome}>
        <JoinGameModal onClose={navigateToHome}/>
      </Modal>
    </div>
  )
}

export default Home