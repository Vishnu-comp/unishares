// import java.io.*;
// import java.nio.file.*;
// import java.util.*;

// public class FetchJsFiles {
//     public static void main(String[] args) {
//         String rootPath = "./"; // Current directory
//         String outputFile = "js_files_content.txt";
        
//         try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))) {
//             // Walk through all files in the directory
//             Files.walk(Paths.get(rootPath))
//                 .filter(Files::isRegularFile)
//                 .filter(path -> path.toString().endsWith(".js"))
//                 .filter(path -> !path.toString().contains("node_modules")) // Exclude node_modules
//                 .filter(path -> !path.toString().contains("dist")) // Exclude dist folder
//                 .filter(path -> !path.toString().contains("build")) // Exclude build folder
//                 .forEach(path -> {
//                     try {
//                         // Write file path
//                         writer.write("=".repeat(80) + "\n");
//                         writer.write("File: " + path.toString() + "\n");
//                         writer.write("=".repeat(80) + "\n\n");
                        
//                         // Write file content
//                         List<String> lines = Files.readAllLines(path);
//                         for (String line : lines) {
//                             writer.write(line + "\n");
//                         }
//                         writer.write("\n\n");
                        
//                         System.out.println("Processed: " + path);
//                     } catch (IOException e) {
//                         System.err.println("Error processing file: " + path);
//                         e.printStackTrace();
//                     }
//                 });
                
//             System.out.println("\nAll JavaScript files have been written to: " + outputFile);
            
//         } catch (IOException e) {
//             System.err.println("Error occurred while processing files:");
//             e.printStackTrace();
//         }
//     }
// }
