import { promises as fs } from 'fs'

export class ChartManager {
    constructor(path) {
        this.charts = [];
        this.path = path
    }
    arePropertiesValid = (products) => {
        const props = [
            'id', 'quantity'
        ];

        for (var i = 0; i < products.length; i++) {
            const invalidProps = props.filter(prop => !(prop in products[i]));
            if (invalidProps.length > 0) {
                    console.log(`Faltan las siguientes propiedades: ${invalidProps.join(', ')}`)
                    return false;
            }
          }
        return true;
    }

    idGenerator = async () => {
        if (!this.idIncrement) {
            if (this.charts.length > 0) {
                const chartId = this.charts.map(p => p['id']);
                this.idIncrement = Math.max(...chartId)
            }
            else{
                this.idIncrement = 0;
            }
        }

        this.idIncrement++
        return this.idIncrement
    }

    incializeFile = async () => {
        const data = await fs.readFile(this.path, 'utf8');
        this.charts = JSON.parse(data);

        if (this.charts.length == 0) {
            console.log("No se encontraron carritos en el archivo");
            return false;
        }

        return true;
    }

    //Creamos metodo global para guardar en el JSON
    saveInJson = async () => {
        await fs.writeFile(this.path, JSON.stringify(this.charts));
    }

    create = async (products) => {
        await this.incializeFile();
        if(!this.arePropertiesValid(products))
            return false;
        
        let chart = {};
        chart.products = products;
        chart.id = await this.idGenerator();

        this.charts.push(chart);
        await this.saveInJson();
        return true;
    }

    addProduct = async (chartId, productId) => {
        await this.incializeFile();
        const cIndex = this.charts.findIndex(c => c.id === chartId);
        if (cIndex === -1) {
            console.log(`No se encontró el carrito con ID: ${chartId}`);
            return false;
        }
        
        const pIndex = this.charts[cIndex].products.findIndex(p => p.id === productId);
        if (pIndex > -1) {
            console.log(`El producto ya existe en el chart, se incrementa la cantidad`);
            this.charts[cIndex].products[pIndex].quantity++;
            await this.saveInJson();
            return true;
        }

        this.charts[cIndex].products.push({
            id: productId,
            quantity: 1
        });
        await this.saveInJson();
        console.log(`Se agregó el producto con ID: ${productId}`);
        return true;
    }
    
    getById = async (chartId) => {
        await this.incializeFile();
        return this.charts.find((chart) => chart.id === chartId);
    };

    getAll = async (limit = 0) => {
        await this.incializeFile();
        
        if (limit > 0)
            this.charts = this.charts.slice(0, limit);

        return this.charts;
    };
}