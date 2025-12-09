export const equipment = [
    {
        category: "Martillos Eléctricos",
        items: [
            { id: "gsh3", name: "Gsh3", description: "Sirve para picar chapado y yeso", specs: { enganche: "SDS PLUS", consumo: "650W" }, keywords: ["picar", "chapado", "yeso"] },
            { id: "gsh5", name: "Gsh5", description: "Sirve para picar chapado con pasta, tabique y 5cm de hormigón", specs: { enganche: "SDS PLUS", consumo: "1100W" }, keywords: ["picar", "chapado", "pasta", "tabique", "hormigon", "5cm"] },
            { id: "gsh11", name: "Gsh11", description: "Sirve para picar 10cm de hormigón, trabajas incorporado y suelo", specs: { enganche: "SDS MAX", consumo: "1500W" }, keywords: ["picar", "hormigon", "10cm", "suelo"] },
            { id: "gsh16", name: "Gsh16", description: "Sirve para picar 20cm de hormigón, trabajas suelo con el", specs: { enganche: "hexagonal", consumo: "1750W" }, keywords: ["picar", "hormigon", "20cm", "suelo"] },
            { id: "gsh27", name: "Gsh27", description: "Sirve para picar 30cm de hormigón", specs: { consumo: "2000W" }, keywords: ["picar", "hormigon", "30cm", "suelo"] }
        ]
    },
    {
        category: "Martillos Rotativos y Taladros",
        items: [
            { id: "gbh2", name: "Gbh2-..", description: "Taladro que sirve para hormigón, hasta 20cm", specs: { toma: "SDS+", consumo: "650W" }, keywords: ["taladro", "hormigon", "20cm"] },
            { id: "gbh3000", name: "Gbh3000", description: "Taladro para hormigón, hasta 28cm y se le puede cambiar las tomas", specs: { consumo: "800W" }, keywords: ["taladro", "hormigon", "28cm"] },
            { id: "gbh578", name: "Gbh5,7,8,..", description: "Sirve para hormigón y puede con un diámetro de broca de 65mm máximo", specs: { toma: "SDS MAX", consumo: "1100W" }, keywords: ["taladro", "hormigon", "broca 65mm"] },
            { id: "gbh11", name: "Gbh11", description: "Sirve para hormigón con broca de hasta 98mm, no sirve para forjado", specs: { enganche: "SDS MAX", consumo: "1500W" }, keywords: ["taladro", "hormigon", "broca 98mm"] }
        ]
    },
    {
        category: "Taladros y Atornilladoras",
        items: [
            { id: "gbh18vx", name: "Gbh18V-X", description: "Puede llevar todo tipo de brocas y tiene martillo", specs: {}, keywords: ["taladro", "martillo", "brocas"] },
            { id: "gsr645", name: "Gsr6-45", description: "Atornilladora para pladur", specs: { consumo: "1600W" }, keywords: ["atornilladora", "pladur"] },
            { id: "gdx18v", name: "Gdx18V", description: "Atornilladora de impacto", specs: {}, keywords: ["atornilladora", "impacto"] },
            { id: "gsb18v12", name: "Gsb 18V-12", description: "Atornillador con taladro", specs: {}, keywords: ["atornillador", "taladro"] }
        ]
    },
    {
        category: "Radiales",
        items: [
            { id: "gws7", name: "Gws7-115/125", description: "Radial común con cable, sirve con disco de 115mm o 125mm", specs: { consumo: "800W" }, keywords: ["radial", "disco 115mm", "disco 125mm"] },
            { id: "gws230", name: "Gws230", description: "Radial grande con disco de corte de 230mm", specs: { consumo: "2000/2500W" }, keywords: ["radial", "grande", "disco 230mm"] },
            { id: "gws18v", name: "Gws18V", description: "Radial común, pero a batería, disco de 115mm", specs: {}, keywords: ["radial", "bateria", "disco 115mm"] },
            { id: "parner", name: "Parner", description: "Cortadora de hormigón, suele usarse para hacer zanjas más pequeñas, se refrigera por agua, disco de 350", specs: {}, keywords: ["cortadora", "hormigon", "zanjas", "agua"] },
            { id: "regatadora", name: "Regatadora", description: "Sirve para hacer regatas, lleva 2 o 3 discos", specs: { consumo: "2300W" }, keywords: ["regatadora", "regatas"] },
            { id: "cortadora_asfalto", name: "Cortadora de asfalto", description: "Para hacer zanjas en el suelo, refrigeración de agua, hasta 11cm de profundidad, gasolina", specs: {}, keywords: ["zanjas", "suelo", "asfalto", "gasolina"] }
        ]
    },
    {
        category: "Perforadoras",
        items: [
            { id: "perforadora_agua", name: "Perforadora de hormigón por agua", description: "Sirve para perforar en hormigón con mayazo. Requiere agujero para taco y expansión.", specs: { consumo: "1850/3000W" }, keywords: ["perforadora", "hormigon", "agua", "mayazo"] }
        ]
    },
    {
        category: "Carpintería",
        items: [
            { id: "sierra_circular", name: "Sierra circular", description: "Para cortar madera, aluminio y pvc. Viene con disco de madera. Cortes precisos y limpios. Ángulo 0-45 grados.", specs: { consumo: "1400W" }, keywords: ["sierra", "circular", "madera", "aluminio", "pvc", "corte"] },
            { id: "caladora", name: "Caladora", description: "Cortes con formas en madera, metal y pvc. Regulable para corte limpio o basto.", specs: { consumo: "650W" }, keywords: ["caladora", "formas", "madera", "metal", "pvc"] },
            { id: "sierra_sable", name: "Sierra sable", description: "Para cortes en basto, madera, metal y pvc.", specs: { consumo: "1250W" }, keywords: ["sierra", "sable", "basto", "madera", "metal", "pvc"] },
            { id: "multiherramienta", name: "Multiherramienta", description: "Pequeños cortes en madera, metal, pvc. Acople starlock.", specs: { consumo: "400W" }, keywords: ["corte", "pequeno", "detalle", "madera", "metal", "pvc"] },
            { id: "ingletadora", name: "Ingletadora", description: "Cortes en madera, especialmente rodapiés. Máx 95mm prof. 150mm long.", specs: { consumo: "1800W" }, keywords: ["ingletadora", "rodapies", "madera", "corte"] }
        ]
    },
    {
        category: "Lijadoras",
        items: [
            { id: "lijadora_jirafa", name: "Lijadora jirafa", description: "Lijar paredes de pladur, gotelé y yeso. Con aspirador.", specs: { consumo: "350W" }, keywords: ["lijadora", "jirafa", "paredes", "pladur", "gotele", "yeso"] },
            { id: "lijadora_excentrica", name: "Lijadora excéntrica", description: "Lijar superficies de madera y fibra.", specs: { consumo: "400W" }, keywords: ["lijadora", "excentrica", "madera", "fibra"] },
            { id: "lijadora_orbital", name: "Lijadora orbital", description: "Lijar superficies con pequeños relieves en madera y fibra.", specs: { consumo: "400W" }, keywords: ["lijadora", "orbital", "madera", "fibra", "relieves"] },
            { id: "lijadora_hormigon", name: "Lijadora de hormigón", description: "Lijar hormigón y pintura en piscinas. No apretar mucho. Con aspirador.", specs: { consumo: "1300W" }, keywords: ["lijadora", "hormigon", "pintura", "piscina"] },
            { id: "cepillo", name: "Cepillo", description: "Cepillar puertas, rebaja hasta 2cm.", specs: { consumo: "710W" }, keywords: ["cepillo", "puertas", "madera"] }
        ]
    },
    {
        category: "Aspiración",
        items: [
            { id: "aspirador_comun", name: "Aspirador Hilti o Bosch", description: "Aspiradora común con filtro y cajón.", specs: { consumo: "2400W" }, keywords: ["aspirador", "polvo"] },
            { id: "puzzi", name: "Puzzi", description: "Limpia tapicerías, tira agua y la chupa.", specs: { consumo: "1200W" }, keywords: ["limpieza", "tapicerias", "agua"] },
            { id: "aspirador_3_etapas", name: "Aspirador tres etapas", description: "Para final de obra, puede chupar agua quitando filtro.", specs: { consumo: "2000/3000W" }, keywords: ["aspirador", "agua", "obra"] }
        ]
    },
    {
        category: "Hidrolimpiadora",
        items: [
            { id: "hidrolimpiadora_bosch", name: "Hidrolimpiadora Bosch", description: "Tira agua a presión, lanza abanico y rotativa.", specs: { consumo: "2600W" }, keywords: ["agua", "presion", "limpieza"] }
        ]
    },
    {
        category: "Hormigonera",
        items: [
            { id: "hormigonera", name: "Hormigonera de 140/190/200L", description: "Para hacer hormigón, cemento, planche...", specs: { consumo: "2200W" }, keywords: ["hormigon", "cemento", "mezcla"] }
        ]
    },
    {
        category: "Vibradores",
        items: [
            { id: "dingo", name: "Dingo vibrador", description: "Quitar oxigeno en paredes, muros, pilares y suelo.", specs: { consumo: "1800W" }, keywords: ["vibrador", "hormigon", "paredes", "muros"] },
            { id: "regla_vibradora", name: "Regla vibradora", description: "Quitar oxigeno en suelo.", specs: { consumo: "100W" }, keywords: ["vibrador", "suelo"] }
        ]
    },
    {
        category: "Compactación",
        items: [
            { id: "pison_tabla", name: "Pisón tabla", description: "Compactar suelo hasta 20cm.", specs: {}, keywords: ["compactar", "suelo", "20cm"] },
            { id: "pison_rana", name: "Pisón Rana", description: "Compactar hasta 50cm.", specs: {}, keywords: ["compactar", "suelo", "50cm"] },
            { id: "rodillo", name: "Rodillo", description: "Aplanar el suelo.", specs: {}, keywords: ["aplanar", "suelo"] }
        ]
    },
    {
        category: "Elevación",
        items: [
            { id: "minoll", name: "Minoll", description: "Elevador 300kg, cable 30m.", specs: {}, keywords: ["elevacion", "carga", "300kg"] },
            { id: "elevador_aires", name: "Elevador de aires", description: "Eleva hasta 200kg, max 4m.", specs: {}, keywords: ["elevacion", "aire", "200kg", "4m"] },
            { id: "elevador_pladur", name: "Elevador de pladur", description: "Levanta lacas hasta 4m.", specs: {}, keywords: ["elevacion", "pladur", "4m"] }
        ]
    },
    {
        category: "Cortadora de Azulejos",
        items: [
            { id: "tx_1025", name: "Tx-1025/1250", description: "Cortar porcelánico.", specs: {}, keywords: ["cortar", "azulejos", "porcelanico"] },
            { id: "batipaz", name: "Cortadora batipaz", description: "Cortes precisos y en piezas rugosas, agua.", specs: {}, keywords: ["cortar", "azulejos", "preciso"] }
        ]
    },
    {
        category: "Neumática",
        items: [
            { id: "compresor_24l", name: "Compresor 24L", description: "Genera aire para pistolas neumáticas, pintura (3CV).", specs: { consumo: "1500W" }, keywords: ["aire", "compresor", "pintura"] },
            { id: "equipo_gotele", name: "Equipo gotelé", description: "Tirar gotelé.", specs: { consumo: "500/1600W" }, keywords: ["gotele", "pintura"] },
            { id: "clavadora_bateria", name: "Clavadora a batería", description: "Clavar clavos en hormigón o madera.", specs: {}, keywords: ["clavar", "madera", "hormigon"] }
        ]
    },
    {
        category: "Grupos Electrógenos",
        items: [
            { id: "grupo_inverter", name: "Grupo inverter", description: "Para equipos electrónicos sensibles (TV, luz).", specs: {}, keywords: ["generador", "luz", "electronica"] },
            { id: "grupo_avr", name: "Grupo Avr", description: "Alto rendimiento (soldadores, radiales).", specs: {}, keywords: ["generador", "soldador", "radial"] }
        ]
    },
    {
        category: "Fontanería",
        items: [
            { id: "bomba_sumergible", name: "Bomba sumergible", description: "Sacar agua sucia (no fecal). 18000L/h.", specs: { consumo: "1300W" }, keywords: ["agua", "bomba"] },
            { id: "multicapa", name: "Multicapa", description: "Prensar tubos multicapa.", specs: {}, keywords: ["tubos", "prensar", "fontaneria"] },
            { id: "expandidor", name: "Expandidor", description: "Expandir tubos.", specs: {}, keywords: ["tubos", "expandir"] },
            { id: "soldador_ppr", name: "Soldador ppr", description: "Unir 2 tubos por calor.", specs: { consumo: "800W" }, keywords: ["tubos", "soldar", "ppr"] },
            { id: "desatascador", name: "Desatascador", description: "Pequeños atascos en tuberías sin codos.", specs: {}, keywords: ["desatascador", "tuberias"] },
            { id: "culebra", name: "Culebra", description: "Desatascar conectada a hidrolimpiadora (min 60mm).", specs: {}, keywords: ["desatascador", "tuberias"] },
            { id: "camara_inspeccion", name: "Cámara de inspección", description: "Encontrar fisuras en tuberías, 10m cable.", specs: {}, keywords: ["camara", "tuberias", "inspeccion"] },
            { id: "comprobador_presion", name: "Comprobador de presión", description: "Comprobar presión en instalación.", specs: {}, keywords: ["presion", "comprobar", "fontaneria"] }
        ]
    },
    {
        category: "Agrícola y Jardín",
        items: [
            { id: "peinadora", name: "Peinadora", description: "Peinar césped artificial.", specs: {}, keywords: ["cesped", "jardin"] },
            { id: "ahoyadora", name: "Ahoyadora", description: "Hacer agujeros en tierra blanda.", specs: {}, keywords: ["agujeros", "tierra"] },
            { id: "escarificador", name: "Escarificador", description: "Oxigenar el césped.", specs: {}, keywords: ["cesped", "jardin"] },
            { id: "soplador", name: "Soplador a batería", description: "Soplador de hojas.", specs: {}, keywords: ["hojas", "jardin", "soplador"] },
            { id: "cortacesped_gasolina", name: "Cortacésped a gasolina", description: "Cortar césped.", specs: {}, keywords: ["cesped", "cortar"] },
            { id: "cortacesped_bateria", name: "Cortacésped a batería", description: "Cortar césped, batería.", specs: {}, keywords: ["cesped", "cortar"] },
            { id: "motoazada", name: "Motoazada", description: "Arar la tierra.", specs: {}, keywords: ["arar", "tierra"] },
            { id: "desbrozadora", name: "Desbrozadora", description: "Quitar hierva/césped. Hilo (verde), Disco (seco).", specs: {}, keywords: ["cesped", "hierba", "jardin"] },
            { id: "motosierra", name: "Motosierra", description: "Cortar madera hasta 40cm.", specs: {}, keywords: ["madera", "cortar", "arbol"] }
        ]
    },
    {
        category: "Soldador",
        items: [
            { id: "soldador_electrodos", name: "Soldador de electrodos", description: "Soldar metal hasta 205A.", specs: { consumo: "6500W" }, keywords: ["soldar", "metal"] }
        ]
    },
    {
        category: "Pintar",
        items: [
            { id: "airless", name: "Airless", description: "Pintar pulverizando.", specs: { consumo: "1200W" }, keywords: ["pintar", "boquilla"] }
        ]
    },
    {
        category: "Turbo Calefactores",
        items: [
            { id: "turbo_calefactor", name: "Turbo calefactor", description: "Secar yeso, calentar.", specs: {}, keywords: ["secar", "yeso", "calor"] }
        ]
    },
    {
        category: "Arrancador de Parquet",
        items: [
            { id: "arrancador_moqueta", name: "Arrancador de moqueta", description: "Quitar parquet, moqueta, vinilo.", specs: { consumo: "500/2000W" }, keywords: ["quitar", "parquet", "moqueta", "vinilo", "suelo"] }
        ]
    }
];
