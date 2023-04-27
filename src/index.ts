import * as functions from "firebase-functions";
import * as cors from "cors"
import * as express from "express"
import * as admin from 'firebase-admin'

admin.initializeApp()

const app = express()

app.use(cors({ origin: true }));
const db = admin.firestore()

app.get('/hello', (req, res) => {
  res.end("Received GET request!");  
});

app.post('/addlike', async (req, res) => {
    const body = req.body as ILike
    try{
        const query = db.doc(`userLiked/${body.userId + encodeURIComponent(body.image)}`)
        const doc = await query.get()
        if(doc.exists){
            query.delete()
            res.status(200).send("Done delete like")
            return
        }
        await db.doc(`userLiked/${body.userId + encodeURIComponent(body.image)}`).set({
            userId: body.userId,
            breeds: body.breeds,
            image: body.image,
            dateAdded: admin.firestore.Timestamp.now()
        })
        res.status(200).send("Done liked");  
    }catch(e){
        console.error(e)
        res.status(500).send(`errorss: ${e}`)
    }
});

interface ILike {
    userId: string;
    image: string;
    breeds: string;
}

export const api = functions.https.onRequest(app);