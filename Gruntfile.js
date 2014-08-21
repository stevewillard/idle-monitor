(function() {
    module.exports = function(grunt) {
        "use strict";

        require("time-grunt")(grunt);
        require("load-grunt-tasks")(grunt);

        grunt.initConfig({
            PATHS: {
                BUILD:  __dirname + "/dist/"
            },

            pkg: grunt.file.readJSON("package.json"),

            srcFiles: ["Gruntfile.js", "<%=pkg.name%>.js"],
            
            jshint2: {
                options : {
                    jshintrc : ".jshintrc",
                    processor: "async",
                    spawnLimit: 50
                },
                files: ["Gruntfile.js", "<%= srcFiles %>"]
            },

            jscs: {
                src: "<%= srcFiles %>",
                options: {
                    config: ".jscsrc"
                }
            },

            uglify: {
                options: {
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today('yyyy-mm-dd') %> */ \n"
                },
                dist: {
                    files: {
                        "<%=pkg.name%>.min.js" : ["<%=pkg.name%>.js"]
                    }
                }
            }
        });

        // Tasks
        grunt.registerTask("test",    ["jshint2", "jscs"]);
        grunt.registerTask("default", ["test", "uglify"]);
    };
})();
