import React, { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast, Toaster } from "react-hot-toast";
import moment from "moment/moment";
import "./Turn.scss";
import "moment/locale/es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarCheck,
	faCheck,
	faClock,
	faCopy,
	faEllipsis,
	faPenToSquare,
	faTrash,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faClock as faClockRegular } from "@fortawesome/free-regular-svg-icons";
import RadioBtn from "../RadioBtn/RadioBtn";
import ToastDeleteTurn from "../ToastDeleteTurn/ToastDeleteTurn";
import { motion } from "framer-motion";
import { toast as toasty, ToastContainer } from "react-toastify";

const Turn = ({
	id,
	placeToShift,
	dateTurn,
	admissionTime,
	departureTime,
	onDelete,
	onEdit,
	docId,
	timeStamp,
	priceShift,
	typeShift,
	workingHours,
}) => {
	moment.locale("es");

	const [isEditable, setIsEditable] = useState(false);
	const [cPlace, setCPlace] = useState(placeToShift);
	const [cDate, setCDate] = useState(dateTurn);
	const [cAdmissionTime, setCAdmissionTime] = useState(admissionTime);
	const [cDepartureTime, setCDepartureTime] = useState(departureTime);
	const [cTypeShift, setCTypeShift] = useState(typeShift);
	const [cPriceShift, setCPriceShift] = useState(priceShift);
	const [cWorkingHours, setCWorkingHours] = useState(workingHours);
	const [showOptions, setShowOptions] = useState(false);
	const menuRef = useRef(null);

	const copyToClipboardValues = `Lugar Turno: ${cPlace}\nFecha: ${cDate}\nHora Ingreso: ${cAdmissionTime}\nHora Salida: ${cDepartureTime}`;

	const turnRef = useRef(null);

	useEffect(() => {
		if (turnRef.current) {
			turnRef.current.focus();
		}
		setCWorkingHours(() => {
			let date1 = moment(cAdmissionTime, "hh:mm A");
			let date2 = moment(cDepartureTime, "hh:mm A");
			return date1.diff(date2, "hours") * -1;
		});
		setCPriceShift(() => {
			//const MINIMUM_SALARY = 1300606;
			
			const NORMAL = 70000;
            const MEDIUM = 35000;
            const FESTIVE = 70000;

			// const NORMAL = MINIMUM_SALARY/30;
			// const MEDIUM = (MINIMUM_SALARY - (0.3346 * MINIMUM_SALARY))/30;
			// const FESTIVE = (MINIMUM_SALARY + (0.499 * MINIMUM_SALARY))/30;

			// const NORMAL = 34573;
			// const MEDIUM = 23073;
			// const FESTIVE = 51823;

			if (cAdmissionTime === "" || cDepartureTime === "") {
				return 0;
			} else {
				let priceHour = 0;
				switch (cTypeShift) {
					case "normal":
						priceHour = NORMAL / 8;
						break;
					case "medio":
						priceHour = MEDIUM / 4;
						break;
					case "festivo":
						priceHour = FESTIVE / 8;
						break;
					case "":
						return 0;
					default:
						return 0;
				}
				return priceHour * cWorkingHours;
			}
		});
	}, [isEditable, cAdmissionTime, cDepartureTime, cTypeShift, cWorkingHours]);

	useEffect(() => {
		const closeMenu = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, []);

	const handleChangePlace = ({ target: { value } }) => setCPlace(value);
	const handleChangeDateTurn = ({ target: { value } }) => setCDate(value);
	const handleChangeAdmissionTime = ({ target: { value } }) =>
		setCAdmissionTime(value);
	const handleChangeDepartureTime = ({ target: { value } }) =>
		setCDepartureTime(value);
	const handleChangeTypeShift = ({ target: { value } }) =>
		setCTypeShift(value);

	const toggleShowOptions = () => {
		setShowOptions(!showOptions);
	};

	const handleEditTurn = () => setIsEditable(true);

	const handleConfirmEdit = () => {
		setIsEditable(false);
		const turnEdited = {
			placeToShift: cPlace,
			dateTurn: cDate,
			admissionTime: cAdmissionTime,
			departureTime: cDepartureTime,
			workingHours: cWorkingHours,
			priceShift: cPriceShift,
			typeShift: cTypeShift,
		};
		onEdit(docId, turnEdited);
		toasty.info("Turno actualizado", {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});
	};

	const handleConfirmDelete = () => {
		toast((t) => (
			<ToastDeleteTurn handleClick={handleDelete} actionToast={t} />
		));
	};

	const handleDelete = () => {
		onDelete(docId);
		toasty.info("El turno ha sido eliminado", {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	};

	const handleCancelEdit = () => {
		setCPlace(placeToShift);
		setCDate(dateTurn);
		setCAdmissionTime(admissionTime);
		setCDepartureTime(departureTime);
		setCPriceShift(priceShift);
		setCWorkingHours(workingHours);
		setCTypeShift(typeShift);
		setIsEditable(false);
	};

	const handleCopyToClipBoard = () => {
		toasty.success("Copiado al portapapeles", {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	};

	const calculateTimeTravel = (time) => {
		let calculatedTime = moment(time, "MMMM Do YYYY, h:mm:ss a")
			.startOf("minute")
			.fromNow();
		return calculatedTime;
	};

	const formatTimestamp = (timeStamp) => {
		return moment(timeStamp, "MMMM Do YYYY, h:mm:ss a").format("D/MM/YY");
	};

	const animacionMenu = {
		hidden: { opacity: 0, scale: 0.9, y: -100 },
		visible: { opacity: 1, scale: 1, y: 0 },
	};

	return (
		<div id={id} className={`turn ${isEditable ? "turn-edit" : ""}`}>
			{isEditable ? (
				<>
					<div className="turn__header">
						<textarea
							name="placeToShift"
							className="turn__header-place-edit"
							value={cPlace}
							onChange={handleChangePlace}
						></textarea>
						<div className="turn__header-btns">
							<button
								onClick={handleConfirmEdit}
								className="turn__btn confirm"
							>
								<FontAwesomeIcon icon={faCheck} />
							</button>
							<button
								onClick={handleCancelEdit}
								className="turn__btn cancel"
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</div>
					</div>
					<div className="turn__body">
						<div className="turn__body-dates-edit">
							<div>
								<b style={{ fontWeight: "700" }}>Fecha:</b>
								<input
									type="date"
									name="dateTurn"
									value={cDate}
									onChange={handleChangeDateTurn}
								/>
							</div>
							<div>
								<b style={{ fontWeight: "700" }}>
									Hora ingreso:
								</b>
								<input
									type="time"
									name="admissionTime"
									value={cAdmissionTime}
									onChange={handleChangeAdmissionTime}
								/>
							</div>
							<div>
								<b style={{ fontWeight: "700" }}>
									Hora salida:
								</b>
								<input
									type="time"
									name="departureTime"
									value={cDepartureTime}
									onChange={handleChangeDepartureTime}
								/>
							</div>
						</div>

						<div className="turn__body-aditionalinfo-edit">
							<p className="turn__body-aditionalinfo-edit-priceshift">
								Precio turno: $
								{cPriceShift.toLocaleString("co-CO", {
									maximumFractionDigits: 1,
								})}{" "}
								COP
							</p>
							<div className="turn__body-aditionalinfo-edit-typeshift">
								{/* <label style={{fontWeight: '700', fontSize: '1rem'}}>Horario de turno</label> */}
								<div className="turn__body-aditionalinfo-edit-typeshift-radios">
									<RadioBtn
										name="typeShift"
										title="normal"
										handleChange={handleChangeTypeShift}
										value="normal"
									/>
									<RadioBtn
										name="typeShift"
										title="medio"
										handleChange={handleChangeTypeShift}
										value="medio"
									/>
									<RadioBtn
										name="typeShift"
										title="festivo"
										handleChange={handleChangeTypeShift}
										value="festivo"
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<header className="turn__header">
						<p className="turn__header-place">{cPlace}</p>
						<div className="turn__header-menu" ref={menuRef}>
							<button
								className="turn__header-menu-btn"
								onClick={toggleShowOptions}
							>
								<FontAwesomeIcon icon={faEllipsis} />
							</button>
							{showOptions && (
								<motion.ul
									className={`turn__header-menu-options ${
										showOptions ? "show" : ""
									}`}
									onClick={() => setShowOptions(false)}
                                    variants={animacionMenu}
                                    initial="hidden"
                                    animate={showOptions ? 'visible' : 'hidden'}
								>
									<CopyToClipboard
										text={copyToClipboardValues}
									>
										<li onClick={handleCopyToClipBoard}>
											Copiar
										</li>
									</CopyToClipboard>
									<li onClick={handleEditTurn}>Editar</li>
									<li onClick={handleConfirmDelete}>
										Eliminar
									</li>
								</motion.ul>
							)}
						</div>
					</header>
					<div className="turn__body">
						<div className="turn__body-infoturn">
							<div className="turn__body-infoturn-date">
								<FontAwesomeIcon icon={faCalendarCheck} />
								<p>
									<b style={{ fontWeight: "700" }}>Fecha:</b>{" "}
									{moment(cDate, "YYYY-MM-DD").format(
										"DD/MM/YYYY"
									)}
								</p>
							</div>
							<div className="turn__body-infoturn-income">
								<FontAwesomeIcon icon={faClock} />
								<p>
									<b style={{ fontWeight: "700" }}>
										Hora ingreso:
									</b>{" "}
									{moment(cAdmissionTime, "HH:mm:ss").format(
										"h:mm A"
									)}
								</p>
							</div>
							<div className="turn__body-infoturn-turnoff">
								<FontAwesomeIcon icon={faClockRegular} />
								<p>
									<b style={{ fontWeight: "700" }}>
										Hora salida:
									</b>{" "}
									{moment(cDepartureTime, "HH:mm:ss").format(
										"h:mm A"
									)}
								</p>
							</div>
						</div>
						<div className="turn__body-aditionalinfo">
							<p className="turn__body-aditionalinfo-price">
								Precio turno: $
								{cPriceShift.toLocaleString("co-CO", {
									maximumFractionDigits: 1,
								})}{" "}
								COP
							</p>
							<p className="turn__body-aditionalinfo-inforegister">
								Creado el {formatTimestamp(timeStamp)},{" "}
								{calculateTimeTravel(timeStamp)}
							</p>
						</div>
					</div>
				</>
			)}
			<Toaster />
			<ToastContainer />
		</div>
	);
};

export default Turn;
