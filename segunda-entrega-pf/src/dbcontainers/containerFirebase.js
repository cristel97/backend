const admin = require('firebase-admin');
const serviceAccount = require('../../proyectobackend-10d04-firebase-adminsdk-u21uo-56a21bfdb4.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const { getFirestore } = require('firebase-admin/firestore');

class Container {
	constructor() {
		this.db = getFirestore();
	}
	//Save an object
	save(obj) {
		try {
			return this.db.collection('products').add(obj);
		} catch (err) {
			console.log(err);
		}
	}
	
	getById(id) {
		try {
			const data = this.db.doc(`/products/${id}`).get();
			return data;
		} catch (err) {
			console.log(err);
		}
	}
	
	getAll() {
		try {
			const allProducts = this.db.collection('products').get();
			return allProducts
		} catch (err) {
			console.log(err);
		}
	}
	
	deleteById(id) {
		try {
			return this.model.findByIdAndDelete(id);
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Container;