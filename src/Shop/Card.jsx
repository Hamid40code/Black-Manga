import { Link } from "react-router-dom";

function Card(prop) {

    return (
        <Link to= "">
            <div className="card-container">
                <img src={prop.img} alt="Manga-Pic" className="card-img"/>
                <h2 className="manga-name">{prop.name}</h2>
                <h3 className="manga-chapter">Chapters:{prop.chapter}</h3>
            </div>
        </Link>
    );
}

export default Card