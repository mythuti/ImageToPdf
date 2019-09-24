/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import './App.css';
import { TesseractWorker } from 'tesseract.js'
import { Redirect } from 'react-router-dom'
const Tesseract = new TesseractWorker(); //var Tesseract = window.Tesseract;


class App extends Component {
    constructor() {
        super()
        this.state = {
            uploads: [], // used for storing the documents 
            Patterns: [], // used for holding the pattern we will define 
            documents: [], // it will take out the otputted doc
            redirect: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.generateText = this.generateText.bind(this)
        this.setRedirect = this.setRedirect.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
    }
    handleChange = (event) => {
        if (event.target.files[0]) {
            var uploads = []
            for (var key in event.target.files) {
                if (!event.target.files.hasOwnProperty(key)) continue;
                let upload = event.target.files[key]
                uploads.push(URL.createObjectURL(upload))
            }
            this.setState({
                uploads: uploads
            })
        } else {
            this.setState({
                uploads: [],
                redirect: true
            })
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to = '/downloads' / >
        }
    }

    generateText = () => {
        console.log("I am clicked")

        let uploads = this.state.uploads
        Tesseract.recognize(uploads[0])
            .progress(progress => {
                console.log('progress', progress);
            }).then(result => {
                console.log('result', result);
            });
        for (var i = 0; i <
            uploads.length; i++) {
            Tesseract
                .recognize(uploads[i], { lang: 'eng' })
                .catch(err => { console.error(err) })
                .then(result => {
                    // Get Confidence score 
                    let confidence = result.confidence
                        // Get full output 
                    let text = result.text
                        // Get codes 
                    let pattern = /\b\w{10,10}\b/g
                    let patterns = result.text.match(pattern);
                    // Update state 
                    this.setState({
                        patterns: this.state.patterns.concat(patterns),
                        documents: this.state.documents.concat({
                            pattern: patterns,
                            text: text,
                            confidence: confidence
                        })
                    })
                })
        }


    }
    render() {
        return ( <
            div className = "app" >
            <
            header className = "header" >
            <
            h1 > NWU - IMAGE - TO - PDF < /h1> </
            header >

            { /*This will take place when the user uploads a picture*/ } <
            section className = "hero" >
            <
            label className = "fileUploaderContainer" >
            Click here to upload documents <
            input type = "file"
            id = "fileUploader"
            onChange = { this.handleChange }
            multiple / >
            <
            /label>

            <
            div > {
                this.state.uploads.map((value, index) => {
                    return <img key = { index }
                    src = { value }
                    width = "100px" / >
                })
            } <
            /div>

            <
            button onClick = { this.generateText }
            className = "button" > Generate < /button> </
            section >

            { /* Results */ } <
            section className = "results" > {
                this.state.documents.map((value, index) => {
                    return ( <
                        div key = { index }
                        className = "results__result" >
                        <
                        div className = "results__result__image" >
                        <
                        img src = { this.state.uploads[index] }
                        width = "250px" / >
                        <
                        /div> <
                        div className = "results__result__info" >
                        <
                        div className = "results__result__info__codes" >
                        <
                        small > < strong > Confidence Score: < /strong> {value.confidence}</small >
                        <
                        /div> <
                        div className = "results__result__info__codes" >
                        <
                        small > < strong > Pattern Output: < /strong> {value.pattern.map((pattern) => { return pattern + ', ' })}</small >
                        <
                        /div> <
                        div className = "results__result__info__text" >
                        <
                        small > < strong > Full Output: < /strong> {value.text}</small >
                        <
                        /div> <
                        /div> <
                        /div>
                    )
                })
            } <
            /section> <
            /div>
        )
    }
}
export default App;