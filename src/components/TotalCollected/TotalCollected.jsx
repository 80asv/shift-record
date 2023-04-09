import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast as toasty, ToastContainer } from "react-toastify";
import "./TotalCollected.scss";

const TotalCollected = ({ collectedThisMounth, turns }) => {
    
    const copyShiftsToClipBoard = () => {
		let text = "Turnos laborales\n\n";
		if (turns.length <= 0) return;
		turns.forEach(
			({ placeToShift, dateTurn, admissionTime, departureTime }) => {
				text += `Lugar Turno: ${placeToShift}\nFecha: ${moment(
					dateTurn,
					"YYYY-MM-DD"
				).format("DD/MM/YYYY")}\nHora Ingreso: ${moment(
					admissionTime,
					"HH:mm"
				).format("hh:mm A")}\nHora Salida: ${moment(
					departureTime,
					"HH:mm"
				).format("hh:mm A")}\n\n`;
			}
		);
		return text;
	};
	return (
		<div className="totalcollected">
			<div className="totalcollected__container">
				<div className="totalcollected__labels">
					<h3 className="totalcollected__labels-title">
						Total Recogido
					</h3>
					<p className="totalcollected__labels-mont">
						$
						{collectedThisMounth.toLocaleString("co-CO", {
							maximumFractionDigits: 1,
						})}{" "}
						COP
					</p>
					<p className="totalcollected__labels-mounth">
						Esto es lo que has ganado el mes de{" "}
						{moment().format("MMMM")}
					</p>
				</div>
				<CopyToClipboard text={copyShiftsToClipBoard()}>
					<button
						className="totalcollected__btn-ctc"
						onClick={() =>
							toasty.success("Turnos visibles copiados!", {
								position: "top-right",
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: "colored",
							})
						}
					>
						<FontAwesomeIcon
							icon={faBook}
							className="card__btn-icon"
						/>
						<p className="card__btn-label">
							Copiar turnos visibles
						</p>
					</button>
				</CopyToClipboard>
			</div>
            <ToastContainer/>
		</div>
	);
};

export default TotalCollected;
