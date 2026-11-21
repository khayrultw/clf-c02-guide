// Answer options for a question. Before a result is known, options are toggleable;
// once a result is passed in, correct and incorrect choices are marked.
export default function OptionList({ question, selected, result, onToggle }) {
  const correctAnswers = result?.answer?.correct_answers || []
  return (
    <div className="option-list">
      {question.options.map((option) => {
        const isSelected = selected.includes(option.key)
        const isCorrectOption = correctAnswers.includes(option.key)
        let optionClass = 'option'
        if (isSelected) optionClass += ' selected'
        if (result && isCorrectOption) optionClass += ' correct'
        if (result && isSelected && !isCorrectOption) optionClass += ' wrong'

        return (
          <button
            type="button"
            className={optionClass}
            key={option.key}
            onClick={onToggle ? () => onToggle(option.key) : undefined}
            aria-pressed={isSelected}
            disabled={Boolean(result) || !onToggle}
          >
            <span className="option-key">{option.key}</span>
            <span>{option.text}</span>
            {result && isCorrectOption && <span className="option-status">Correct answer</span>}
            {result && isSelected && !isCorrectOption && <span className="option-status">Your answer</span>}
          </button>
        )
      })}
    </div>
  )
}
