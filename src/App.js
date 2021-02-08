import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import DonacionesLlamado from "./DonacionesLlamado";
import { DonacionesService } from "./DonacionesService";
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment';

const estaDisponible = (finalizo) => {
    if(finalizo){
        return  <span className="badge badge-danger" style={{backgroundColor:"red"}}>NO DISPONIBLE</span>;
    }else{
        return <span className="badge badge-success" style={{backgroundColor:"#22bb33"}}>DISPONIBLE</span>;
    }
}


export class App extends Component {

    constructor(props) {
        super(props);
        this.state ={
            account : undefined,
            proyectos : [],
            numproyectos : 0,
            nombreProyecto : '',
            descripcionProyecto : '',
            totalProyecto : '',
            minimoProyecto : '',
            fechaInicioProyecto : '',
            fechaFinProyecto : '',
            idProyectoDonar : 0,
            nickNameDonar : '',
            donacionDonar : 0,
            confirmacionDonar : false,
            idProyectoPost : 0,
            urlPost : '',
        }
        this.handleChangeNombreProyecto = this.handleChangeNombreProyecto.bind(this);
        this.handleChangeDescripcionProyecto = this.handleChangeDescripcionProyecto.bind(this);
        this.handleChangeTotalProyecto = this.handleChangeTotalProyecto.bind(this);
        this.handleChangeMinimoProyecto = this.handleChangeMinimoProyecto.bind(this);
        this.handleChangeFechaInicioProyecto = this.handleChangeFechaInicioProyecto.bind(this);
        this.handleChangeFechaFinProyecto = this.handleChangeFechaFinProyecto.bind(this);

        this.handleChangeNickNameDonar = this.handleChangeNickNameDonar.bind(this);
        this.handleChangeDonacionDonar = this.handleChangeDonacionDonar.bind(this);
        this.handleChangeconfirmacionDonar = this.handleChangeconfirmacionDonar.bind(this);

        this.handleChangeUrlPost= this.handleChangeUrlPost.bind(this);
    }
    mostrarFinalizar(finalizo,idProyecto){
        if(finalizo){
            return <button type="button" className="btn btn-light" disabled>Finalizado</button>;
        }else{
            return <button type="button" className="btn btn-danger" onClick={() => this.finalizarProyecto(idProyecto)} >Finalizar</button>;
        }
    }
    fechaFormato(fecha){
        // console.log(fecha);
        return moment(fecha).format("DD/MM/YYYY");
        // return <div>{fecha}</div>
    }
    handleChangeNombreProyecto(event) {
        this.setState({nombreProyecto: event.target.value});
    }
    handleChangeDescripcionProyecto(event) {
        this.setState({descripcionProyecto: event.target.value});
    }
    handleChangeTotalProyecto(event) {
        this.setState({totalProyecto: event.target.value});
    }
    handleChangeMinimoProyecto(event) {
        this.setState({minimoProyecto: event.target.value});
    }
    handleChangeFechaInicioProyecto(event) {
        this.setState({fechaInicioProyecto: event.target.value});
    }
    handleChangeFechaFinProyecto(event) {
        this.setState({fechaFinProyecto: event.target.value});
    }

    handleChangeNickNameDonar(event) {
        this.setState({nickNameDonar: event.target.value});
    }
    handleChangeDonacionDonar(event) {
        this.setState({donacionDonar: event.target.value});
    }
    handleChangeconfirmacionDonar(event) {
        this.setState({confirmacionDonar: event.target.value});
    }

    handleChangeUrlPost(event) {
        this.setState({urlPost: event.target.value});
    }
    
    async componentDidMount() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('!!MetaMask is installed!');
        }else{
            ethereum.enable();
        }

        this.web3 = await getWeb3();
        console.log(this.web3.currentProvider);
        this.donacionesLlamado =  await DonacionesLlamado(this.web3.currentProvider);
        console.log(this.donacionesLlamado);
        this.donacionesService = new DonacionesService(this.donacionesLlamado);
        console.log(this.donacionesService);


        console.log(this.web3.version);
        var account = (await this.web3.eth.getAccounts())[0];
        console.log(account);

        ethereum.on('accountsChanged', (accounts) => {
            this.setState({account: accounts[0]}, () => this.load())
        });

        this.setState({
            account: account.toLowerCase()
        },()=>{
            this.load();
        });
    }
    async crearProyecto() {
        let nombre = this.state.nombreProyecto;
        let descripcion = this.state.descripcionProyecto;
        let total = this.state.totalProyecto;
        let minimoDonacion  = this.state.minimoProyecto;
        let fechaInicio = this.state.fechaInicioProyecto;
        let fechaFin = this.state.fechaFinProyecto;

        // console.log(fechaInicio);

        let fechaInicioDate = moment(fechaInicio, 'DD/MM/YYYY').format();
        let fechaFinDate = moment(fechaFin, 'DD/MM/YYYY').format();

        // console.log(dd);

        let fechaInicioDateNumber = moment(fechaInicioDate).valueOf();
        let fechaFinDateNumber = moment(fechaFinDate).valueOf();

        // console.log(de);
        // console.log(moment(de).format("DD/MM/YYYY"));


        let fechaCreacion = 16115406202;
        let from = this.state.account;
        await this.donacionesService.crearProyecto(
            nombre, descripcion,
            total, minimoDonacion, fechaCreacion, 
            fechaInicioDateNumber, fechaFinDateNumber, from
        );
        location.reload();
    }
    async getProyectos(){
        let numproyectos = await this.donacionesService.getTotalProyectos();
        console.log(numproyectos);
        this.setState({
            numproyectos
        }); 
        let proyectos = await this.donacionesService.getProyectos(); 
        console.log(proyectos);
        this.setState({
            proyectos,numproyectos
        });
    }
    async finalizarProyecto(idProyecto) {
        let from = this.state.account;
        await this.donacionesService.finalizarProyecto(idProyecto,from);
        location.reload();
    }
    async irDonar(idProyecto) {
        this.setState({
            idProyectoDonar:idProyecto
        });
        location.href='#donarDiv';
    }
    async donar() {
        let idProyecto = this.state.idProyectoDonar;
        let nickName = this.state.nickNameDonar;
        let deseoConfirmenConPost = this.state.confirmacionDonar;
        let from = this.state.account;
        let value = this.state.donacionDonar;
        await this.donacionesService.donar(idProyecto,nickName,deseoConfirmenConPost,from,value);
        location.reload();
    }
    async transferir(idProyecto,idDonacion) {
        let from = this.state.account;
        await this.donacionesService.transferir(idProyecto,idDonacion,from);
        location.reload();
    }
    async irPostear(idProyecto) {
        console.log('=====================>'+idProyecto);
        this.setState({
            idProyectoPost:idProyecto
        });
        location.href='#postDiv';
    }
    async postear() {
        let idProyecto = this.state.idProyectoPost;
        let url = this.state.urlPost;
        let from = this.state.account;
        let id = await this.donacionesService.postear(idProyecto,url,from);
        console.log(id);
        location.reload();
    }
    async load(){
        this.getProyectos();
    }
    render() {
        return <React.Fragment>  
            <main>
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center" style={{backgroundColor: '#AA0007'}} >
        <div className="row">
            <div className="col-md-5 p-lg-5 mx-auto my-5"  >
                <img width="584" height="263" alt="" loading="lazy" 
                datasrcset="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w" 
                datasrc="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                datasizes="(max-width: 584px) 100vw, 584px" 
                className="attachment-large size-large lazyloaded" 
                src="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                sizes="(max-width: 584px) 100vw, 584px" 
                srcSet="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w">
                </img>
            </div>
          <div className="col-md-5 p-lg-5 mx-auto my-5"  >
            <h1 className="display-5 fw-normal text-light">Marco para la Gesti&oacute;n tus Donaciones</h1>
            <p className="lead fw-normal text-light">Generando una cultura de donaciones por medio de la transparencia y confidencialidad.</p>
            <a className="btn btn-outline-secondary text-light" href="#creacionProyectoDiv"  >Crea un proyecto</a>
          </div>

        </div>
        
    </div>
   


    {this.state.proyectos.map((proy , i)=>{
        return <div key={i}>
            <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
                <div className="bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
                    <div className="my-3 py-3"  >
                    
                    
                    <h2 className="display-5">{proy.nombre} &nbsp;{ estaDisponible(proy.finalizo) } </h2>

                    <p className="lead">{proy.descripcion} &nbsp;{ this.mostrarFinalizar(proy.finalizo,proy.idProyecto) } </p>
                    </div>
                    <div className="bg-light shadow-sm mx-auto" style={{width: "100%", height: "300px", borderRadius: "21px 21px 0 0", paddingTop: "70px"}}>
                        <div className="row">
                            <div className="col-md-6 font-weight-light text-dark" style={{textAlign: "right"}}>
                                <h1 className="card-title pricing-card-title">Fecha Inicio : <small className="text-muted">
                                    {/* {moment(proy.fechaInicio).format("MMM Do YY")} */}
                                    {
                                        this.fechaFormato(proy.fechaInicio)
                                    }
                                    {/* <Moment format="YYYYMMDD">
                                    proy.fechaInicio
                                    </Moment> */}
                                    </small></h1>
                            </div>
                            <div className="col-md-6 font-weight-light text-dark" style={{textAlign: "left"}}>
                                <h1 className="card-title pricing-card-title">Fecha Fin : <small className="text-muted">
                                    {/* {proy.fechaFin} */}
                                    {
                                        this.fechaFormato(proy.fechaFin)
                                    }
                                    </small></h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 font-weight-light text-dark" style={{textAlign: "right"}}>
                                <h1 className="card-title pricing-card-title">Total Acumulado : <small className="text-muted">{proy.acumulado}</small></h1>
                            </div>
                            <div className="col-md-6 font-weight-light text-dark" style={{textAlign: "left"}}>
                                <h1 className="card-title pricing-card-title">Total Esperado : <small className="text-muted">{proy.total}</small></h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 font-weight-light text-dark" style={{textAlign: "center"}}>
                                <h1 className="card-title pricing-card-title">Donacion Minima : <small className="text-muted">{proy.minimoDonacion}</small></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
                <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div className="my-3 p-3" >
                    <h2 className="display-5">Donaciones</h2>
                        <p className="lead">Tu tanbien puedes ayudarnos &nbsp;
                                    <button className="btn btn-sm btn-warning text-white" 
                                        onClick={() => this.irDonar(proy.idProyecto)}>Donar</button>
                        </p>
                    </div>
                    <div className="bg-dark shadow-sm mx-auto" style={{width: "80%",borderRadius: "21px 21px 0 0", paddingTop: "40px"}}>
                        <div className="font-weight-light text-light "  >
                            {
                                proy.donaciones.map((donac, e)=>{
                                    if(donac.transfirio){
                                        return <div key={e}><a href={`https://www.facebook.com/${donac.nickName}`} className="btn-lg" target="_blank" >@{donac.nickName}</a><br></br></div>;
                                    }else{
                                        return <div key={e} >
                                                <a href={`https://www.facebook.com/${donac.nickName}`} className="btn-lg" target="_blank" >@{donac.nickName}</a>
                                                <button className="btn btn-sm btn-warning text-white" 
                                                    onClick={() => this.transferir(proy.idProyecto,donac.idDonacion)}>Transferir</button>
                                                <br></br>
                                            </div>;
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div className="my-3 p-3">
                    <h2 className="display-5">Posts</h2>
                        <p className="lead">Acompañanos viendo lo logrado &nbsp;
                                    <button className="btn btn-sm btn-warning text-white" 
                                        onClick={() => this.irPostear(proy.idProyecto)}>Post</button>
                        </p>
                    </div>
                    <div className="bg-dark shadow-sm mx-auto" style={{width: "80%",borderRadius: "21px 21px 0 0", paddingTop: "40px"}}>
                        <div className="font-weight-light text-light "  >
                            {
                                proy.posts.map((pos, e)=>{
                                    return <div key={e}><a href={`${pos.url}`} className="btn-lg" target="_blank" >{pos.url}</a><br></br></div>;
                                })
                            }
                        </div>
                    </div>
                </div> 
            </div>

        </div>
    })}
    
<div id="creacionProyectoDiv"  className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center" style={{backgroundColor: '#AA0007'}} >
    <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
            <h4 className="mb-3 text-light">Crear Proyecto</h4>   
            <form className="needs-validation" >
                <div className="row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="firstName" className="text-light">Nombre</label>
                    <input type="text" className="form-control" id="nombre" placeholder="" value={this.state.nombreProyecto} onChange={this.handleChangeNombreProyecto} required></input>
                    <div className="invalid-feedback">
                    Valid first name is required.
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="lastName" className="text-light">Descripci&oacute;n</label>
                    <input type="text" className="form-control" id="descripcion" placeholder="" value={this.state.descripcionProyecto} onChange={this.handleChangeDescripcionProyecto} required></input>
                    <div className="invalid-feedback">
                    Valid last name is required.
                    </div>
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="text-light">Total</label>
                    <input type="text" className="form-control" id="total" placeholder="" value={this.state.totalProyecto} onChange={this.handleChangeTotalProyecto}  required></input>
                    <div className="invalid-feedback">
                    Valid first name is required.
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="text-light">Minimo</label>
                    <input type="text" className="form-control" id="minimo" placeholder="" value={this.state.minimoProyecto} onChange={this.handleChangeMinimoProyecto}  required></input>
                    <div className="invalid-feedback">
                    Valid last name is required.
                    </div>
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="text-light">Fecha Inicio</label>

                    <input type="text" className="form-control" id="fechaInicio" placeholder="" 
                    value={this.state.fechaInicioProyecto} onChange={this.handleChangeFechaInicioProyecto}  required></input>

                    <div className="invalid-feedback">
                    Valid first name is required.
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="text-light">Fecha Fin</label>
                    <input type="text" className="form-control" id="fechaFin" placeholder="" value={this.state.fechaFinProyecto} onChange={this.handleChangeFechaFinProyecto}  required></input>
                    <div className="invalid-feedback">
                    Valid last name is required.
                    </div>
                </div>
                </div>
                <hr className="mb-4"></hr>
                <button className="btn btn-primary btn-lg btn-block" type="button" onClick={() => this.crearProyecto()} >Crear Proyecto</button>

            </form>   
        </div>
        <div className="col-md-8 order-md-1">
            <img width="584" height="263" alt="" loading="lazy" 
                datasrcset="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w" 
                datasrc="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                datasizes="(max-width: 584px) 100vw, 584px" 
                className="attachment-large size-large lazyloaded" 
                src="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                sizes="(max-width: 584px) 100vw, 584px" 
                srcSet="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w">
                </img>
        </div>
    </div>

</div>

<div id="donarDiv" >
    <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
        <div className="bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
        <div className="row">
            <div className="col-md-8 order-md-1">
                <img width="584" height="263" alt="" loading="lazy" 
                datasrcset="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w" 
                datasrc="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                datasizes="(max-width: 584px) 100vw, 584px" 
                className="attachment-large size-large lazyloaded" 
                src="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                sizes="(max-width: 584px) 100vw, 584px" 
                srcSet="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w">
                </img>
            </div>
            <div className="col-md-4 order-md-2 mb-4">
                <h4 className="mb-3 text-light">Donar a numero proyecto {this.state.idProyectoDonar}</h4>   
                <form className="needs-validation" >
                    <div className="row">
                        <div className="col-md-12 mb-3"> 
                                <label htmlFor="username">Nickname</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">@</span>
                                    </div>
                                    <input type="text" className="form-control" id="username" value={this.state.nickNameDonar} onChange={this.handleChangeNickNameDonar}  required></input>
                                    <div className="invalid-feedback" style={{width: "100%"}}>
                                    Your username is required.
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastName" className="text-light">Donaci&oacute;n</label>
                            <input type="text" className="form-control" id="descripcion" placeholder="" value={this.state.donacionDonar} onChange={this.handleChangeDonacionDonar} required></input>
                            <div className="invalid-feedback">
                            Valid last name is required.
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <br></br>
                            <div className="custom-control custom-checkbox"></div>
                            <input type="checkbox" className="custom-control-input" id="same-address" value={this.state.confirmacionDonar} onChange={this.handleChangeconfirmacionDonar}></input>
                            <label className="custom-control-label" htmlFor="same-address">&nbsp;Post confirmaci&oacute;n</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <br></br>
                            <div className="custom-control custom-checkbox"></div>
                            <input type="checkbox" className="custom-control-input" id="terminoscondiciones"  ></input>
                            <label className="custom-control-label"  >&nbsp;<a href="/terminosycondiciones.pdf" target="_blank" >Terminos y Condiciones</a></label>
                        </div>
                    </div>
                    <hr className="mb-4"></hr>
                    <button className="btn btn-primary btn-lg btn-block" type="button" onClick={() => this.donar()} >Donar</button>
                </form>   
            </div>
            
        </div>
        </div>
    </div>
</div>




<div id="postDiv" >
    <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
        <div className="bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
        <div className="row">
            <div className="col-md-8 order-md-1">
                <img width="584" height="263" alt="" loading="lazy" 
                datasrcset="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w" 
                datasrc="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                datasizes="(max-width: 584px) 100vw, 584px" 
                className="attachment-large size-large lazyloaded" 
                src="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png" 
                sizes="(max-width: 584px) 100vw, 584px" 
                srcSet="https://caminodevida.com/wp-content/uploads/2020/05/servooooo.png 584w, https://caminodevida.com/wp-content/uploads/2020/05/servooooo-300x135.png 300w">
                </img>
            </div>
            <div className="col-md-4 order-md-2 mb-4"  >
                <h4 className="mb-3 text-light">Post a numero proyecto {this.state.idProyectoPost}</h4>   
                <form className="needs-validation" >
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="lastName" className="text-light">Url</label>
                            <input type="text" className="form-control" id="descripcion" placeholder="" value={this.state.urlPost} onChange={this.handleChangeUrlPost} required></input>
                            <div className="invalid-feedback">
                            Valid last name is required.
                            </div>
                        </div> 
                    </div>
                    <hr className="mb-4"></hr>
                    <button className="btn btn-primary btn-lg btn-block" type="button" onClick={() => this.postear()} >Postear</button>
                </form>   
            </div>
            
        </div>
        </div>
    </div>
</div>

</main>

        </React.Fragment>
    }
}