# Exam Study Tool

### File Name Convention
* Filenames should begin with s_, t_, a_ for student, teacher and admin portal specific files respectively.
* index.ejs is the splash page
* Landing pages for student, teacher and admin portals should be named as s_home, t_home and a_home respectively.

---

### IMPORTANT!! --- How to Commit Files?
* Do not commit changes or add new files to 'main'.
* Always select "Create a new branch for this commit and start a pull request." and then create a pull request.

### Repository Structure
.  
├── app.js  
├── package-lock.json  
├── package.json  
├── model  
├── public/  
│   ├── images  
│   ├── javascripts  
│   └── stylesheets  
├── routes  
└── views  


1. app.js
2. package.json, package-lock.json
3. public
   - images
     - (all .png, .jpg, .jpeg files live here)
   
   - javascripts
     - (all .js files live here)

   - stylesheets
     - (all .css files live here)

2. routes
   - index.js : route for splash page
   - student.js : route for student pages
   - teacher.js : route for teacher pages
   - admin.js : route for admin pages

3. views
   - index.ejs : splash page
   - s_home.ejs : Student Landing Page
   - s_profile.ejs : Student Profile Page
   - s_learning_topics.ejs : Student Learning by Topics Page
   - s_learning_archive.ejs : Student Learning from Test Archives Page
   - s_assessment_assigned.ejs : Student Assessment - Assigned by Teacher Page
   - s_assessment_tests.ejs : Student Assessment - Tests Page
   - t_home.ejs : Teacher Landing Page
   - a_home.ejs : Admin Landing Page
 
---
 
#### Do's and Dont's
* css common for all the pages will be in style.css file
* If a css file is specific to a particular filename.ejs page, then save that file as filename.css in public/stylesheets folder
* If a js file is specific to a particular filename.ejs page, then save that file as filename.js in public/javascripts folder

---
