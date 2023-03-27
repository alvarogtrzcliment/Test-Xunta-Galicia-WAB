///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////


define(["esri/Color",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/SpatialReference",
        'dojo/_base/lang',
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        'dojo/_base/declare',
        'jimu/BaseWidget'],
  function(Color,SimpleLineSymbol,SimpleFillSymbol,Graphic, SpatialReference, lang, Query, QueryTask, declare, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'filtro-parroquias',

      cargaConcellos: function(){

        //Recojo el código de la provincia

        let codigoProvincia = this.selectProvincia.value;
        if(codigoProvincia == -1) return;

        //Limpio el combo de concellos
        this.listaConcellos.innerHTML=""

        //Leo la URL del fichero de Config y creo un Query Task con ella.

        let concellosQT = new QueryTask(this.config.urls.urlConcellosService);

        //Configuro la Query de los concellos

        let queryConcellos = new Query()
        queryConcellos.returnGeometry = false;
        queryConcellos.outFields = ["CODCONC","CONCELLO"]
        queryConcellos.where = "CODPROV = '" + codigoProvincia + "'"

        //Ejecuto la Query con el Query task

        concellosQT.execute(queryConcellos, lang.hitch(this, function(results){

          //Creamos la opcion por defecto

          opt = document.createElement("option")
          opt.value = '-1'
          opt.innerHTML = "Selecciona un concello"
          this.listaConcellos.add(opt)

          //Creamos las demas opciones leyendo los resultados

          //Creo una variable con el feature set

          let concellos = results.features

          //Recorro la variable con un bucle for

          for (var i = 0; i < concellos.length; i++){
            opt = document.createElement("option")
            opt.value = concellos[i].attributes.CODCONC;
            opt.innerHTML = concellos[i].attributes.CONCELLO;
            this.listaConcellos.add(opt)
          }

          //Cambio el display para que pueda ver el panel

          this.concellos.style.display = "flex"

        }));


      },

      zoomConcello: function(){

        // En primer lugar leo el codigo del concello y si es -1 no hago nada

        let codigoConcello = this.listaConcellos.value
        if (codigoConcello == -1) return;

        //Realizo la consulta pero ahora con la geometría activada

        //Configuro la QueryTask con el archivo de Configuracion

        let concellosQT = new QueryTask(this.config.urls.urlConcellosService)

        //Configuro la Query que le voy a pasar a la Query task

        let queryConcellos = new Query()
        queryConcellos.returnGeometry = true;
        queryConcellos.outFields = ["CODCONC","CONCELLO"]
        queryConcellos.where = "CODCONC = '" + codigoConcello + "'"
        queryConcellos.outSpatialReference = new SpatialReference(102100)
        
        //Ejecuto la query

        concellosQT.execute(queryConcellos,lang.hitch(this,function(results){

          if(results.features.length >0) {

            //Guardo la geometría del resultado

            let geometria = results.features[0].geometry;

            //creo la simbología

            var simboloLinea = new SimpleLineSymbol();
            simboloLinea.setColor(new Color([0, 77, 168, 1]));
            simboloLinea.setStyle(SimpleLineSymbol.STYLE_DASHDOTDOT);
            var simbologia = new SimpleFillSymbol();
            simbologia.setColor(new Color([0, 197, 255, 0.25]));
            simbologia.setOutline(simboloLinea);  

            //Limpio la capa gráfica, pinto el polígono y cambio el extent para que se centre en el concello

            this.map.graphics.clear()
            this.map.graphics.add(new Graphic(geometria,simbologia))
            this.map.setExtent(geometria.getExtent(),true)
          
          }

        }))
      },

      cargaParroquias: function(){

        //Recojo el codigo de concello

        let codigoConcello = this.listaConcellos.value
        if (codigoConcello == -1) return;

        //Limpio el combo de parroquias

        this.listaParroquias.innerHTML=""

        //Leo la URL del archivo de configuracion

        let parroquiasQT = new QueryTask(this.config.urls.urlParroquiasService)

        //Configuro la Query de las Parroquias

        let queryParroquias = new Query()
        queryParroquias.returnGeometry = false;
        queryParroquias.outFields = ["CODPARRO","PARROQUIA"]
        queryParroquias.where = "CODCONC = '" + codigoConcello + "'"

        //Ejecuto la Query con el Query task

        parroquiasQT.execute(queryParroquias, lang.hitch(this, function(results){

          //Creamos la opcion por defecto

          opt = document.createElement("option")
          opt.value = '-1'
          opt.innerHTML = "Selecciona un parroquia"
          this.listaParroquias.add(opt)

          //Creamos las demas opciones leyendo los resultados

          //Creo una variable con el feature set

          let parroquias = results.features

          //Recorro la variable con un bucle for

          for (var i = 0; i < parroquias.length; i++){
            opt = document.createElement("option")
            opt.value = parroquias[i].attributes.CODPARRO;
            opt.innerHTML = parroquias[i].attributes.PARROQUIA;
            this.listaParroquias.add(opt)
          }

          //Cambio el display para que pueda ver el panel

          this.parroquias.style.display = "flex"

        }));

      },

      zoomParroquia: function(){

        // En primer lugar leo el codigo del concello y si es -1 no hago nada

        let codigoParroquia = this.listaParroquias.value
        if (codigoParroquia == -1) return;

        //Realizo la consulta pero ahora con la geometría activada

        //Configuro la QueryTask con el archivo de Configuracion

        let parroquiasQT = new QueryTask(this.config.urls.urlParroquiasService)

        //Configuro la Query que le voy a pasar a la Query task

        let queryParroquias = new Query()
        queryParroquias.returnGeometry = true;
        queryParroquias.outFields = ["CODPARRO","PARROQUIA"]
        queryParroquias.where = "CODPARRO = '" + codigoParroquia + "'"
        queryParroquias.outSpatialReference = new SpatialReference(102100)
        
        //Ejecuto la query

        parroquiasQT.execute(queryParroquias,lang.hitch(this,function(results){

          if(results.features.length >0) {

            //Guardo la geometría del resultado

            let geometria = results.features[0].geometry;

            //creo la simbología

            var simboloLinea = new SimpleLineSymbol();
            simboloLinea.setColor(new Color([168, 0, 132, 1]));
            simboloLinea.setStyle(SimpleLineSymbol.STYLE_DASHDOTDOT);
            var simbologia = new SimpleFillSymbol();
            simbologia.setColor(new Color([255, 115, 223, 0.25]));
            simbologia.setOutline(simboloLinea);  

            //Limpio la capa gráfica, pinto el polígono y cambio el extent para que se centre en el concello

            this.map.graphics.clear()
            this.map.graphics.add(new Graphic(geometria,simbologia))
            this.map.setExtent(geometria.getExtent(),true)
          
          }

        }))

      }

    });
  });