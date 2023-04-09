import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import './UserSettings.scss'

const UserSettings = () => {

	const { user } = useAuth();

	return (
		<div>
			<header className="st__header">
				<Link to="/dashboard" className="st__header-link">
					<FontAwesomeIcon icon={faArrowLeft} />
				</Link>
				<span className="st__header-span">Configuraciones</span>
				<button className="st__header-btn-save">Guardar</button>
			</header>
			<div className="st__body">
			    <h2 className="st__body-h2">Configuraciones de cuenta personal</h2>
				<main className="st__body-main">
					<section className="st__body-main-main-settings">
						<div className="st__body-main-main-settings-img settingscard">
                            <img src={user.photoURL || '/dummy-avatar.jpg'} alt="images user" />
                            <label htmlFor="chooseimg" className="st__body-main-main-settings-img-label">
                                Elegir una imagen
                            </label>
                            <input className="st__body-main-main-settings-img-input" type="file" id="chooseimg" />
						</div>
						<div className="st__body-main-main-settings-username settingscard">
							<label className="settingscard__label" htmlFor="username">Nombre de usuario</label>
							<input className="settingscard__input" type="text" name="username" id="username" autoComplete="off"/>
						</div>
						<div className="st__body-main-main-settings-name settingscard">
							<label className="settingscard__label" htmlFor="name">Nombre de usuario</label>
							<input className="settingscard__input" type="text" name="name" id="name" autoComplete="off"/>
						</div>
						<div className="st__body-main-main-settings-theme settingscard">
							<label className="settingscard__label" htmlFor="name">Modo oscuro</label>
							<ThemeToggle />
						</div>
						<div className="st__body-main-main-settings-notifications settingscard">
							<label className="settingscard__label" htmlFor="name">Recibir  notificaciones</label>
							<ThemeToggle isTheme={true} />
						</div>
					</section>
					<h3 className="st__h3">Otras opciones</h3>
					<section className="st__body-main-other-settings">
						<div className="st__body-main-other-settings-shift-values settingscard">
							<label htmlFor="name">Valor de los turnos</label>
                            <span>Con estos valor se podrán calcular todos los turnos que registres</span>
							<div className="st__body-main-other-settings-shift-values-full">
								<label htmlFor="full-shift">
									Tiempo completo
								</label>
								<input type="text" id="full-shift" />
							</div>
							<div className="st__body-main-other-settings-shift-values-half">
								<label htmlFor="half-shift">Medio turno</label>
								<input type="text" id="half-shift" />
							</div>
							<div className="st__body-main-other-settings-shift-values-festive">
								<label htmlFor="festive-shift">
									Turno festivo
								</label>
								<input type="text" id="festive-shift" />
							</div>
							<button className="st__body-main-other-settings-shift-values-update-values">
								Actualizar todos los turnos a estos valores
							</button>
						</div>
						<div className="st__body-main-other-settings-shift-delete-shifts settingscard">
                            <span>Borrar turnos</span>
							<p>
								Se eliminarán todos los turnos que hayas
								registrado
							</p>
							<button>Eliminar todos los turnos</button>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default UserSettings;
