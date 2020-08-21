const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movie = require("../models/Movies");

//Getting all movies
router.get("/moviesApi" , async (req, res)=>{
    try{
        const allMovies = await Movie.find();
        // res.render("allMovies.ejs" , {allMovies: allMovies})     uncomment this statement if you want to view it in ejs format
        res.json(allMovies);   //comment this if you want to view ejs format
    }catch(err){
        return res.status(404).json({error:"Something went wrong!"});
    }
});

//Getting One movie with id
router.get("/moviesApi/:id" ,getMovie, (req, res)=>{
    const foundMovie = res.movie;
    // res.render("movieById.ejs" , {foundMovie :foundMovie })   //uncomment this statement if you want to view it in ejs format
    res.json(foundMovie);    //comment this if you want to view ejs format
});

//searching movie with name(fuzzy search)
router.get("/moviesApi/search/:id" , (req , res)=>{
    if(req.params.id){
        const regex = new RegExp(escapeRegex(req.params.id), 'gi');
        Movie.find({name:regex} , (err , foundMovie)=>{
            if(err){
                console.log(err);
            }else{
                // res.render("moviesByName.ejs" , {foundMovie:foundMovie})  uncomment this statement if you want to view it in ejs format
                res.json(foundMovie);   //comment this if you want to view ejs format 
            }
        });
    } 
});

//Creating new movie
router.post("/moviesApi" , async (req, res)=>{
    const {name, img, summary} = req.body;

    if(!name || !img || !summary){
        return res.status(400).json({message:"Please add all the values"});
    }
    
    const newMovie = new Movie({
        name,
        img,
        summary
    });

    try{
        const addMovie = await newMovie.save();
        res.json(addMovie);
    }catch (err){
        res.status(400).json({error:"Unable to add new movie" });
    }
});

//Updating movie
router.patch("/moviesApi/:id" ,getMovie, async (req, res)=>{
    if(req.body.name != null){
        res.movie.name = req.body.name;
    }
    if(req.body.img != null){
        res.movie.img = req.body.img;
    }
    try {
        const updatedMovie = await res.movie.save();
        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({error:"Cannoot Update the movie"});
    }
});

//delete movie
router.delete("/moviesApi/:id" ,getMovie, async (req, res)=>{
    try {
        await res.movie.remove()
        res.json({message:"Successfully Removed the movie"});
    } catch (error) {
        res.status(400).json({error:"Something Went wrong"});
    }
});

//middelwares
async function getMovie(req, res, next){
    let movie;
    try{
        movie = await Movie.findById(req.params.id);
        if(movie === null){
            return res.status(404).json({error:"Cannot find movie"});
        }
    }catch(err){
        return res.status(400).json({error:"Something went wrong"});
    }

    res.movie = movie;
    next();
}

//function for fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;