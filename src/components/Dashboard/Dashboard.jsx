import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onMessage } from "firebase/messaging";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast as toasty, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteTurn, getTurns, messaging, updateTurn } from "../../db/firebase";
import HomeWrapper from "../HomeWrapper/HomeWrapper";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";
import SelectList from "../SelectList/SelectList";
import Turn from "../Turn/Turn";
import "./Dashboard.scss";

const Dashboard = () => {
	const { user, enableNotifications } = useAuth();
	
	const [loading, setLoading] = useState(true);

	const [listPlaces, setListPlaces] = useState([]);
	const [listMouths, setListMouths] = useState([]);
	const [collectedThisMounth, setCollectedThisMounth] = useState(0);
	
	const [dateFilter, setDateFilter] = useState(localStorage.getItem('dateFilter') || "");
	const [placeFilter, setPlaceFilter] = useState(localStorage.getItem('placeFilter') ||"");

	const [turns, setTurns] = useState(JSON.parse(localStorage.getItem("turns")) || []);

	useEffect(() => {
		onMessage(messaging, (msg) => toasty(msg.notification.title));
	}, []);

	useEffect(() => {
		enableNotifications();
		const getTurnsList = async () => {
			const res = await getTurns(user.uid);

			/* Listas */
			setListPlaces(() => {
				// listar lugares
				const places = res.map((turn) => turn.placeToShift);
				return [...new Set(places)]; // eliminar los repetidos
			});
			setListMouths(() => {
				// listar meses
				const dates = res.map((turn) =>
					moment(turn.dateTurn, "YYYY-MM-DD").format("MMMM YYYY")
				);
				return [...new Set(dates)];
			});
			setCollectedThisMounth(() => {
				const currentMounth = moment().format("MM");
				const filterDates = res.filter(
					(turn) =>
						moment(turn.dateTurn, "YYYY-MM-DD").format("MM") ===
						currentMounth
				);
				let totalCollectedThisMounth = 0;
				filterDates.forEach(
					(turn) => (totalCollectedThisMounth += turn.priceShift)
				);
				return totalCollectedThisMounth;
			});

			/* Filtros */
			let newList = res.filter((turn) => {
				if (dateFilter && moment(turn.dateTurn, "YYYY-MM-DD").format("MMMM YYYY") !== dateFilter) {
					return false;
				}
				if (placeFilter && turn.placeToShift !== placeFilter) {
					return false;
				}
				return true;
			}).sort((a, b) => moment(b.timeStamp, 'MMMM Do YYYY, h:mm:ss a') - moment(a.timeStamp, 'MMMM Do YYYY, h:mm:ss a')); // Ordena los objetos por id en orden descendente;

			setTurns(newList);
			localStorage.setItem("turns", JSON.stringify(newList));
			setLoading(false);
		};
		console.log("first");
		getTurnsList();
	}, [user.uid, user, dateFilter, placeFilter]); // TODO: REVISAR SI SE ESTA CICLANDO

	const handleDeleteTurn = async (docId) => {
		await deleteTurn(docId);
		const tmp = turns.filter((turn) => turn.docId !== docId);
		setTurns([...tmp]);
	};

	const handleEditTurn = async (docId, turnEdited) => {
		let turn = turns.find((turn) => turn.docId === docId);
		turn = { ...turn, ...turnEdited };
		await updateTurn(docId, turn);
	};

	const handleDateChange = (e) => {
		setDateFilter(e.target.value);
		localStorage.setItem("dateFilter", e.target.value);
	};
	
	const handlePlaceChange = (e) => {
		setPlaceFilter(e.target.value);
		localStorage.setItem("placeFilter", e.target.value);
	};

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
		<HomeWrapper>
			<ToastContainer />
			<div className="dashboard__header">
				<h2>
					<p className="dashboard__header-saludo">Bienvenid@</p>
					<p className="dashboard__header-saludo-name">
						{user.displayName}
					</p>
				</h2>
				<div className="card">
					<div className="card__info">
						<p className="card__info-title">
							Total recogido este mes
						</p>
						<p className="card__info-money">
							$
							{collectedThisMounth.toLocaleString("co-CO", {
								maximumFractionDigits: 1,
							})}{" "}
							COP
						</p>
						<p className="card__info-label">
							suma total del mes de {moment().format("MMMM")}
						</p>
					</div>

					<CopyToClipboard text={copyShiftsToClipBoard()}>
						<button
							className="card__btn"
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
			</div>
			<main className="main">
				<h3 className="main__misturnos">Mis turnos</h3>
				<div className="main__btns">
					<Link
						to="/dashboard/agregar-turno"
						className="main__btns-agregarturno"
					>
						<FontAwesomeIcon icon={faBook} />
						<p>Nuevo turno</p>
					</Link>
					<div className="main__btns-filters">
						<SelectList
							className="main__btns-filters-place main__btns-filters-btn"
							value={placeFilter}
							id="placeToShift"
							title="lugares"
							handleChange={handlePlaceChange}
							data={listPlaces}
						/>
						<SelectList
							className="main__btns-filters-date main__btns-filters-btn"
							value={dateFilter}
							id="mounths"
							title="mes"
							handleChange={handleDateChange}
							data={listMouths}
						/>
					</div>
				</div>
				<div className="main__turns">
					{turns.length <= 0 && !loading && (
						<p
							style={{
								fontSize: "22px",
								color: "var(--color-grey)",
								width: "100%",
								display: "flex",
								justifyContent: "center",
							}}
						>
							No hay turnos que mostrar
						</p>
					)}
					{turns.map((turn) => (
						<Turn
							key={turn.id}
							typeShift={turn.typeShift}
							priceShift={turn.priceShift}
							timeStamp={turn.timeStamp}
							id={turn.id}
							docId={turn.docId}
							placeToShift={turn.placeToShift}
							dateTurn={turn.dateTurn}
							admissionTime={turn.admissionTime}
							departureTime={turn.departureTime}
							onDelete={handleDeleteTurn}
							onEdit={handleEditTurn}
						/>
					))}
				</div>
			</main>
			{loading && <Loader />}
		</HomeWrapper>
	);
};

export default Dashboard;
