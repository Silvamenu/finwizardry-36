
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CTA = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl opacity-50 dark:bg-gray-800/50"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl opacity-50 dark:bg-gray-800/50"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 p-8 md:p-12 max-w-4xl mx-auto text-center rounded-3xl shadow-modern dark:shadow-modern-dark"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Transforme suas finanças com o <span className="text-momoney-600 dark:text-momoney-400">MoMoney</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            O MoMoney não é apenas uma IA, é um verdadeiro parceiro financeiro para transformar sua vida e seus negócios. Comece agora mesmo!
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              "Reduza seus gastos em até 30%",
              "Invista de forma inteligente e segura",
              "Planeje seu futuro financeiro"
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 text-left bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl"
              >
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 shadow-sm">
                  <Check className="w-4 h-4 text-momoney-600 dark:text-momoney-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button className="bg-momoney-600 hover:bg-momoney-500 text-white px-8 py-6 text-lg rounded-2xl">
              Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-6 text-lg rounded-2xl">
              Agendar Demonstração
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
