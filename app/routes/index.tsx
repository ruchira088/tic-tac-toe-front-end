import {Link} from "react-router"

const Index = () => {
  return (
    <div>
      <div>
        <Link to="/home">Home</Link>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
      </div>
    </div>
  )
}

export default Index