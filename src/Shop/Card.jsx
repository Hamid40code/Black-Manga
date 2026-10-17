
import './Style.css'

function Card(prop) {
    return (
            <div className="card-container">

                <div className="card-img-container">
                    <img src={prop.img} alt="card-Pic" className="card-img" />
                </div>

                <h2 className="text" style={{marginBottom : 0}}>{prop.name}</h2>
                <h3 className="text" style={{marginBottom : 0}}>Chapters:{prop.chapter}</h3>

            </div>
    );
}

export default Card