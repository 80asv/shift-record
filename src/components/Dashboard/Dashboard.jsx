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
import Header from "../Header/Header";
import TotalCollected from "../TotalCollected/TotalCollected";

const Dashboard = () => {
	const { user, enableNotifications } = useAuth();

	const [loading, setLoading] = useState(true);

	const [listPlaces, setListPlaces] = useState([]);
	const [listMouths, setListMouths] = useState([]);
	const [collectedThisMounth, setCollectedThisMounth] = useState(0);

	const [dateFilter, setDateFilter] = useState(
		localStorage.getItem("dateFilter") || ""
	);
	const [placeFilter, setPlaceFilter] = useState(
		localStorage.getItem("placeFilter") || ""
	);

	const [turns, setTurns] = useState(
		JSON.parse(localStorage.getItem("turns")) || []
	);

	useEffect(() => {
		onMessage(messaging, (msg) => toasty(msg.notification.title));
	}, []);

	//TODO eliminar localstorage al momentod de cerrar sesion

	useEffect(() => {
		enableNotifications();
		const getTurnsList = async () => {
			setLoading(true);
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
			let newList = res
				.filter((turn) => {
					if (
						dateFilter &&
						moment(turn.dateTurn, "YYYY-MM-DD").format(
							"MMMM YYYY"
						) !== dateFilter
					) {
						return false;
					}
					if (placeFilter && turn.placeToShift !== placeFilter) {
						return false;
					}
					return true;
				})
				.sort(
					(a, b) =>
						moment(b.timeStamp, "MMMM Do YYYY, h:mm:ss a") -
						moment(a.timeStamp, "MMMM Do YYYY, h:mm:ss a")
				); // Ordena los objetos por id en orden descendente;

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

	/* Header sticky shadow */
	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 372) {
				setIsSticky(true);
			} else {
				setIsSticky(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		// Cleanup function to remove the event listener
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<ToastContainer />
			<div>
				<Header/>
				<TotalCollected
					collectedThisMounth={collectedThisMounth}
					turns={turns}
				/>
			</div>
			<main className="main">
				<header className={`main__header ${isSticky ? "sticky" : ""}`}>
					<h3>Mis Turnos</h3>
					<div className="main__header-filters">
						<SelectList
							className="main__header-filters place"
							value={placeFilter}
							id="placeToShift"
							title="Lugares"
							handleChange={handlePlaceChange}
							data={listPlaces}
						/>
						<SelectList
							className="main__header-filters date"
							value={dateFilter}
							id="dateTurn"
							title="Fechas"
							handleChange={handleDateChange}
							data={listMouths}
						/>
					</div>
				</header>
				<section className="main__turns">
					<div className="main__turns-buttons">
						<Link
							className="main__turns-buttons-addturn"
							to="/dashboard/agregar-turno"
						>
							<FontAwesomeIcon icon={faBook} />
							<p>Agregar turno</p>
						</Link>
						{/* <button className="main__turns-buttons-togglegridturns">
							<svg
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g
									id="页面-1"
									stroke="none"
									strokeWidth="1"
									fill="none"
								>
									<g
										id="Design"
										transform="translate(-144.000000, -336.000000)"
									>
										<g
											id="layout_grid_fill"
											transform="translate(144.000000, 336.000000)"
										>
											<path
												d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
												id="MingCute"
											></path>
											<path
												d="M3,5 C3,3.89543 3.89543,3 5,3 L11,3 L11,11 L3,11 L3,5 Z M11,13 L3,13 L3,19 C3,20.1046 3.89543,21 5,21 L11,21 L11,13 Z M13,21 L19,21 C20.1046,21 21,20.1046 21,19 L21,13 L13,13 L13,21 Z M13,11 L13,3 L19,3 C20.1046,3 21,3.89543 21,5 L21,11 L13,11 Z"
												id="形状"
												fill="#CBCFDCFF"
											></path>
										</g>
									</g>
								</g>
							</svg>
						</button> */}
					</div>
					<p className="main__turns-turns-count">
						{turns.length} Turnos
					</p>
					<div className="main__turns-turns">
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
				</section>
			</main>
			{loading && <Loader />}
		</>
	);
};

export default Dashboard;
