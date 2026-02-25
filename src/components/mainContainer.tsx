import "../components/mainContainer.css"

export const MainContainer = () => {
    return (
        <div className="main-container">
            <QuestionContainer />
            <AnswerContainer />
        </div>
    )
}   

const QuestionContainer = () => {
    return (
        <p>"how you doing?"</p>
    )
}

const AnswerContainer = () => {
    return (
        <p>"how you doing?"</p>
    )
}