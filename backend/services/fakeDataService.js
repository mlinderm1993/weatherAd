
function FakeDataService() {
    const fakeJson = {

        img: {
            src: 'debug/1.jpeg',
            desc: 'Text für ein bild'
        },

        data: {
            temperature: '12',
            pressure: '0.5',
            humidity: '50',
            fineParts: '10000'
        }
    }

    FakeDataService.prototype.getFakeData = () => {
        return fakeJson;
    }

    FakeDataService.prototype.getFakeTime = () => {
        return new Date();
    }
}



module.exports = new FakeDataService();