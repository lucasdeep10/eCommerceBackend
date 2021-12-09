import fs from 'fs';
import __dirname from '../utils.js';

const productURL = __dirname+'/files/products.txt';

class ContenedorProduct{
    async registerProduct(product){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let products = JSON.parse(data);
            let id = product[product.length-1].id+1;
            product.adopted=false;
            product =Object.assign({id:id},product);
            products.push(product)
            try{
                await fs.promises.writeFile(productURL,JSON.stringify(products,null,2));
                return {status:"success",message:"Producto registrada"}
            }catch{
                return {statis:"error",message:"No se pudo registrar el producto"} 
            }
        }catch{
            product.adopted=false;
            product = Object.assign({id:1},product)
            try{
                await fs.promises.writeFile(petURL,JSON.stringify([pet],null,2));
                return {status:"success", message:"Producto registrado"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo registrar el producto"}
            }
        }
    }
    async registerUser(user){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            let id = users[users.length-1].id+1;
            user.hasProd = false;
            user = Object.assign({id:id},user);
            users.push(user);
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(users,null,2));
                return {status:"success",message:"Usuario registrado"}
            }catch{
                return {statis:"error",message:"No se pudo registrar al usuario"} 
            }
        }catch{
            user.hasProd = false;
            user = Object.assign({id:1},user)
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify([user],null,2));
                return {status:"success", message:"Usuario registrado"}
            }
            catch{
                return {status:"error",message:"No se pudo registrar al usuario"}
            }
        }
    }
    async getAllPets(){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            return {status:"success",payload:pets}
        }catch{
            return {status:"error",message:"Error al obtener las mascotas. Intente más tarde"}
        }
    }
    async getAllUsers(){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            return {status:"success",payload:users}
        }catch{
            return {status:"error",message:"Error al obtener los usuarios. Intente más tarde"}
        }
    }
    async getPetById(id){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let pets = JSON.parse(data);
            let pet = pets.find(v => v.id===id)
            if(pet){
                return {status:"success", payload:pet}
            }else{
                return {status:"error",message:"Producto no encontrada"}
            }
        }catch{
            return {status:"error",message:"Error al obtener el Producto"}
        }
    }
    async getUserById(id){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            let user = users.find(v => v.id===id)
            if(user){
                return {status:"success", payload:user}
            }else{
                return {status:"error",message:"Usuario no encontrado"}
            }
        }catch{
            return {status:"error",message:"Error al obtener al usuario"}
        }
    }
    async adoptPet(uid,pid){
        try{
            let petData = await fs.promises.readFile(petURL,'utf-8');
            let userData = await fs.promises.readFile('./files/users.txt','utf-8');
            let products = JSON.parse(petData);
            let users = JSON.parse(userData);
            let product = products.find(v=>v.id===pid);
            let user = users.find(v=>v.id===uid);
            if(!product) return {status:"error", message:"No se encontró producto"};
            if(!user) return {status:"error",message:"Usuario no encontrado"};
            if(product.adopted) return {status:"error",message:"El producto ya está disponible"};
            if(user.hasProd) return {status:"error", message:"El producto ya esta cargado"};
            product.adopted=true;
            user.hasPet=true;
            product.owner=user.id;
            user.product = product.id;
            let userAux = users.map(us=>{
                if(us.id===user.id){
                    return user;
                }else{
                    return us
                }
            })
            let prodAux = products.map(pt=>{
                if(pt.id===product.id){
                    return product;
                }else{
                    return pt
                }
            })
            await fs.promises.writeFile(petURL,JSON.stringify(prodAux,null,2));
            await fs.promises.writeFile('./files/users.txt',JSON.stringify(userAux,null,2));
            return {status:"success",message:"Producto Cargado!"}
        }catch(error){
            return {status:"error", message:"No se pudo subir el producto "+error}
        }
    }
    async updateUser(id,body){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            if(!users.some(user=>user.id===id)) return {status:"error", message:"No hay ningún usuario con el id especificado"}
            let result = users.map(user=>{
                if(user.id===id){
                    if(user.hasPet){
                        body = Object.assign(body,{hasProd:true,product:user.product})
                        body = Object.assign({id:user.id,...body})
                        return body
                    }
                    else{
                        body = Object.assign(body,{hasProd:false})
                        body = Object.assign({id:user.id,...body})
                        return body;
                    }
                }else{
                    return user;
                }
            })
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(result,null,2));
                return {status:"success", message:"Usuario actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el usuario"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el usuario"}
        }
    }
    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(pt=>pt.id===id)) return {status:"error", message:"No hay productos con el id especificado"}
            let result = products.map(product=>{
                if(product.id===id){
                    if(product.adopted){
                        body = Object.assign(body,{adopted:true,owner:product.owner})
                        body = Object.assign({id:product.id,...body});
                        return body;
                    }
                    else{
                        body = Object.assign(body,{adopted:false})
                        body = Object.assign({id:id,...body})
                        return body;
                    }
                }else{
                    return product;
                }
            })
            try{
                await fs.promises.writeFile(petURL,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizada"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el producto: "+error}
        }
    }
    async deleteProduct(id){
        try{
            let data = await fs.promises.readFile(petURL,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(product=>product.id===id)) return {status:"error", message:"No hay producto con el id especificado"}
            let product = products.find(v=>v.id===id);
            if(product.adopted){
                try{
                    let userData = await fs.promises.readFile('./files/users.txt','utf-8');
                    let users = JSON.parse(userData);
                    users.forEach(user=>{
                        if(user.product===id){
                            user.hasProd=false;
                            delete user['product']
                        }
                    })
                    await fs.promises.writeFile('./files/users.txt',JSON.stringify(users,null,2));
                }catch(error){
                    return {status:"error", message:"Fallo al eliminar el producto: "+error}
                }
            }
            let aux = products.filter(product=>product.id!==id);
            try{
                await fs.promises.writeFile(petURL,JSON.stringify(aux,null,2));
                return {status:"success",message:"Producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el producto"}
            }
        }catch{
            return {status:"error", message:"Fallo al elimintar producto"}
        }
    }
    async deleteUser(id){
        try{
            let data = await fs.promises.readFile('./files/users.txt','utf-8');
            let users = JSON.parse(data);
            if(!users.some(us=>us.id===id)) return {status:"error", message:"No hay ningún usuario con el id proporcionado"}
            let user = users.find(us=>us.id===id);
            if(user.hasPet){
                try{
                    let petData = await fs.promises.readFile(petURL,'utf-8');
                    let pets = JSON.parse(petData);
                    pets.forEach(pet=>{
                        if(pet.owner===id){
                            pet.adopted=false;
                            delete pet['owner']
                        }
                    })
                    await fs.promises.writeFile(petURL,JSON.stringify(pets,null,2));
                }catch{
                    return {status:"error", message:"fallo al eliminar el usuario"}
                }
            }
            let aux = users.filter(user=>user.id!==id);
            try{
                await fs.promises.writeFile('./files/users.txt',JSON.stringify(aux,null,2));
                return {status:"success",message:"Usuario eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar la mascota"}
            }
        }
        catch{
            return {status:"error",message:"Fallo al eliminar el usuario"}
        }
    }
}

export default ContenedorProduct;