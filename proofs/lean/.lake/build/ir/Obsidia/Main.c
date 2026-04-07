// Lean compiler output
// Module: Obsidia.Main
// Imports: public import Init public import Obsidia.CryptoAssumptions public import Obsidia.Basic public import Obsidia.Consensus public import Obsidia.Merkle public import Obsidia.Seal public import Obsidia.Sensitivity public import Obsidia.SystemModel public import Obsidia.TemporalX108 public import Obsidia.Refinement
#include <lean/lean.h>
#if defined(__clang__)
#pragma clang diagnostic ignored "-Wunused-parameter"
#pragma clang diagnostic ignored "-Wunused-label"
#elif defined(__GNUC__) && !defined(__CLANG__)
#pragma GCC diagnostic ignored "-Wunused-parameter"
#pragma GCC diagnostic ignored "-Wunused-label"
#pragma GCC diagnostic ignored "-Wunused-but-set-variable"
#endif
#ifdef __cplusplus
extern "C" {
#endif
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_CryptoAssumptions(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Consensus(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Merkle(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_TemporalX108(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Refinement(uint8_t builtin);
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Main(uint8_t builtin) {
lean_object * res;
if (_G_initialized) return lean_io_result_mk_ok(lean_box(0));
_G_initialized = true;
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_CryptoAssumptions(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Consensus(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Merkle(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_TemporalX108(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Refinement(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
