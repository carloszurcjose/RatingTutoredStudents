import { StarRadioProps } from "../types/StarRadioProps";

const StarRadio: React.FC<StarRadioProps> = ({ name, label, value, onChange }) => {
    return (
        <div className="field">
            <label className="question">{label}</label>
            <div className="star-group" role="radiogroup" aria-label={label}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className={`star ${n <= value ? "active" : ""}`}>
                        <input
                            type="radio"
                            name={name}
                            value={n}
                            checked={value === n}
                            onChange={() => onChange(n)}
                        />
                        {/*<span aria-hidden>★</span>*/}
                        <span className="sr-only">{n}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default StarRadio;