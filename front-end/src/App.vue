<template>
<div id="app">
   <div id="nav">
      <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">Phlash</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
         <ul class="navbar-nav">
            <li class="nav-item">
               <router-link to="/">
                  <a class="nav-link" href="#">home</a>
               </router-link>
            </li>
            <li class="nav-item">
               <router-link :to="{ name: 'Upload' }">
                  <a class="nav-link" href="#">upload</a>
               </router-link>
            </li>
            <li class="nav-item">
               <router-link :to="{ name: 'Data' }">
                  <a class="nav-link" href="#">data</a>
               </router-link>
            </li>
         </ul>
      </div>
   </nav>
   </div>
   <router-view/>
</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
