/* Creando espacio de nombres */

(function (window) {

    window.mdj = window.mdj || {};

    window.mdj.media = window.mdj.media || {};


}(window));

/* Declaración de eventos */

(function(namespace){

    console.log(">> Escuchando eventos..");


    var Events = function () {



    }

    //-- Creacion de espacio de nombres

    namespace.Events = Events;
}(mdj.media));

/* Modelos de datos por defecto*/

(function(namespace){


    var DataModel = function (data) {

        console.log(">> Cargando modelo de datos..");

        //console.log("datamodel>", data);

        var checkData = function (dataplayer) {

            if (typeof (dataplayer) == "undefined" || dataplayer == "") {

                return false;
            } else {

                return true;
            }
        }

        //--parametros configuracion fapi

        this.id_cuenta = data.id_cuenta;                                                  //--ID cuenta
        this.media_type = data.media_type;                                                //--Tipo de medio ej:video/audio
        this.id_player = data.id_player;                                                  //--Identificador del player ej:20
        this.id_media = data.id_media;                                                    //--Identificador del video
        this.id_container = data.id_container;                                            //--Identificador de la capa
        this.width = (checkData(data.width)) ? data.width : "800";                        //--ancho por defecto del video
        this.height = (checkData(data.height)) ? data.height : "360";                     //--alto por defecto del video

        //--parametros de videojs

        this.skin = (checkData(data.skin)) ? data.skin : "video-js vjs-default-skin";     //--skin por defecto
        this.playbackRates = data.playbackRates;                                          //--Velocidad de reproduccion
        this.techOrder = data.techOrder;                                                  //--Orden de tecnologias
        this.width = data.width;                                                          //--ancho
        this.height = data.height;                                                        //--alto
        this.controls = data.controls;                                                    //--controles
        this.autoplay = data.autoplay;                                                    //--Autoinicio
        this.preload = data.preload;                                                      //--Precarga del video



    }

    //-- Creacion de espacio de nombres

    namespace.DataModel = DataModel;
}(mdj.media));
/* Componentes MDJPlayer */

(function (namespace) {

    console.log(">> Cargando Interface..");

    var UI = function () {


    }

    //-- Creacion de espacio de nombres

    namespace.UI = UI;
}(mdj.media));
/* Controlador de estadisticas */

(function (namespace) {

    console.log(">> Cargando estadisticas..");

    var StatController = function () {



    }

    //-- Creacion de espacio de nombres

    namespace.StatController = StatController;
}(mdj.media));
/* Instanciación y configuración del player */

(function (namespace) {


    FAPI_URL = "http://fapi-top.prisasd.com/api";


//--Instanciación del playerMDJ


    var PlayerMDJ = function (data) {

        console.log(">> Cargando configuracion..");


        //--Configuracion para el player
        var dataConfiguration = data;
        var that = this;


        //--Creacion e instanciacion del player
        this.PlayerInstance = function (parameters, player) {

            //--Validacion de datos
            var playerDataModel = new mdj.media.DataModel(player);

            // Crear nodo - etiqueta
            var playerElement = document.createElement("video");
            playerElement.id = playerDataModel.id_container + "_video";
            document.getElementById(playerDataModel.id_container).appendChild(playerElement);

            //Configuramos el player
            var playerID = document.getElementById(playerElement.id);

            playerID.className = playerDataModel.skin;

            playerID.src = parameters.asset[0].url[2].url; //---video mp4 por defecto

            var mainPlayer = videojs(playerID, {
                "playbackRates": playerDataModel.playbackRates,
                "techOrder": playerDataModel.techOrder,
                "width": playerDataModel.width,
                "height": playerDataModel.height,
                "controls": playerDataModel.controls,
                "autoplay": playerDataModel.autoplay,
                "preload": playerDataModel.preload,
                "poster": parameters.url_video_still
            }, function () {

                /* esta funcion se inicializa despues de la carga del player */

                console.log(">>video inicializado");

                //--Incluir boton bitrate

                var buttonBitrate = mainPlayer.controlBar.addChild('button', {
                    text: 'Press Me'
                });

                buttonBitrate.addClass("mdj_button_bitrate");

                buttonBitrate.on('click', function () {
                    console.log('->Cambio de calidad');
                });

                //buttonBitrate.trigger('customevent');


                //--Incluir boton bitrate

           /*     var buttonshare = mainPlayer.controlBar.addChild('button', {
                    text: 'Press Me'
                });

                buttonBitrate.addClass("mdj_button_share");

                buttonBitrate.on('click', function () {
                    console.log('->Compartir redes sociales');
                });*/



            });

        }

        this.PlayerReset = function (parameters, player) {

            var playerID = document.getElementById(player.id_container + "_video_html5_api");

            playerID.pause();

            playerID.src = parameters.asset[0].url[2].url; //---video mp4 por defecto

            playerID.play();


        }


//---Mediador , cargando la configuracon de la fapi

        this.PlayerMediator = function (data, reset) {


            //--Recuperando la configuracion inicial
            var ajaxData = data;

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {

                    //--parseamos e instanciacion del player

                    if (reset) {

                        that.PlayerReset(JSON.parse(xhttp.responseText), data);               //--cargar nueva configuracion

                    } else {

                        that.PlayerInstance(JSON.parse(xhttp.responseText), dataConfiguration); //--configuracion por defecto
                    }


                }
            };
            xhttp.open("GET", FAPI_URL + "/" + ajaxData.id_cuenta + "/" + ajaxData.media_type + "/" + ajaxData.id_media + "/", true);
            xhttp.send();

        };


        //--Inicio de configuracion y reset

        this.PlayerFactory = function (data) {


            if (data == "" || data === undefined) {

                that.PlayerMediator(dataConfiguration);  //--Configuracion inicial
            } else {
                that.PlayerMediator(data, true);         //--nueva configuracion

            }


        }


    }


    //-- Creacion de espacio de nombres

    namespace.PlayerMDJ = PlayerMDJ;

}(mdj.media))
